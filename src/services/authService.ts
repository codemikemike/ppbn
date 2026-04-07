import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { IUserRepository } from "@/domain/interfaces/IUserRepository";
import type { ChangePasswordDto } from "@/domain/dtos/ChangePasswordDto";
import type { DashboardStatsDto } from "@/domain/dtos/DashboardStatsDto";
import type { RegisterDto } from "@/domain/dtos/RegisterDto";
import type { UpdateUserProfileDto } from "@/domain/dtos/UpdateUserProfileDto";
import type { UserDto } from "@/domain/dtos/UserDto";
import type { UserReviewListItemDto } from "@/domain/dtos/UserReviewListItemDto";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/domain/validations/authSchema";
import {
  changePasswordSchema,
  updateUserProfileSchema,
} from "@/domain/validations/userSchema";
import {
  EmailExistsError,
  ValidationError,
  UnauthorizedError,
} from "@/domain/errors/DomainErrors";
import { userRepository } from "@/repositories/userRepository";
import { auditLogService } from "./auditLogService";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

/**
 * Authentication use cases (registration and credentials-based login).
 */
export class AuthService {
  /**
   * Creates a new AuthService.
   * @param userRepository - User repository used for persistence and lookup.
   * @returns A new AuthService instance.
   */
  constructor(private userRepository: IUserRepository) {}

  /**
   * Registers a new user after validating input and hashing the password.
   * @param dto - Registration input.
   * @returns The created user as a UserDto.
   * @throws ValidationError if the registration input is invalid.
   * @throws EmailExistsError if the email is already registered.
   */
  async registerUser(dto: RegisterDto): Promise<UserDto> {
    const validationResult = registerSchema.safeParse(dto);

    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const validatedData = validationResult.data;

    const existingUser = await this.userRepository.findByEmail(
      validatedData.email,
    );

    if (existingUser) {
      throw new EmailExistsError();
    }

    const hashedPassword = await this.hashPassword(validatedData.password);

    const user = await this.userRepository.create({
      email: validatedData.email,
      name: validatedData.name,
      password: hashedPassword,
      role: "RegisteredUser",
    });

    // Log registration
    await auditLogService
      .logAction("Register", "User", user.id, user.id, {
        newValues: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      })
      .catch((err) => {
        console.error("Failed to log registration:", err);
      });

    return user;
  }

  /**
   * Authenticates a user by verifying credentials.
   * @param email - User email.
   * @param password - User password.
   * @returns The authenticated user as a UserDto.
   * @throws ValidationError if email/password input is invalid.
   * @throws UnauthorizedError if credentials are invalid or the user cannot log in.
   */
  async authenticateUser(email: string, password: string): Promise<UserDto> {
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const { email: validatedEmail, password: validatedPassword } =
      validationResult.data;

    const user =
      await this.userRepository.findByEmailWithPassword(validatedEmail);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await this.verifyPassword(
      validatedPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Log successful login
    await auditLogService
      .logAction("Login", "User", user.id, user.id)
      .catch((err) => {
        console.error("Failed to log login:", err);
      });

    const { password: passwordHash, ...userWithoutPassword } = user;
    void passwordHash;
    return userWithoutPassword;
  }

  /**
   * Requests a password reset link for the given email.
   *
   * This operation is designed to be safe against account enumeration: callers should return a
   * generic success response regardless of whether the email exists.
   *
   * @param email - Email address to send a reset link to.
   * @returns Nothing.
   * @throws ValidationError if the email is invalid.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const validationResult = forgotPasswordSchema.safeParse({ email });

    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const validatedEmail = validationResult.data.email;
    const user = await this.userRepository.findByEmail(validatedEmail);
    if (!user) return;

    const rawToken = this.generateResetToken();
    const tokenHash = this.hashResetToken(rawToken);
    const expiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await this.userRepository.setResetToken(user.id, tokenHash, expiry);

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(
      rawToken,
    )}`;

    // Email delivery is out of scope for now. Log the link for development.
    console.info(
      `[Auth] Password reset link for ${validatedEmail}: ${resetLink}`,
    );
  }

  /**
   * Resets a user's password given a reset token.
   *
   * @param token - Raw reset token.
   * @param newPassword - New password (plain text).
   * @returns Nothing.
   * @throws ValidationError if token/password input is invalid or the token is invalid/expired.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const validationResult = resetPasswordSchema.safeParse({
      token,
      password: newPassword,
    });

    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const tokenHash = this.hashResetToken(validationResult.data.token);
    const user = await this.userRepository.findByResetToken(tokenHash);

    if (!user || !user.passwordResetExpiry) {
      throw new ValidationError("Invalid or expired token", [
        { field: "token", message: "Invalid or expired token" },
      ]);
    }

    if (user.passwordResetExpiry.getTime() < Date.now()) {
      throw new ValidationError("Invalid or expired token", [
        { field: "token", message: "Invalid or expired token" },
      ]);
    }

    const hashedPassword = await this.hashPassword(
      validationResult.data.password,
    );
    await this.userRepository.updatePassword(user.id, hashedPassword);
  }

  /**
   * Returns dashboard stats counts for the given user.
   * @param userId - User id.
   */
  async getDashboardStats(userId: string): Promise<DashboardStatsDto> {
    return this.userRepository.getDashboardStats(userId);
  }

  /**
   * Lists the current user's reviews.
   * @param userId - User id.
   */
  async listMyReviews(userId: string): Promise<UserReviewListItemDto[]> {
    return this.userRepository.listMyReviews(userId);
  }

  /**
   * Updates the current user's profile.
   * @param userId - User id.
   * @param dto - Profile update input.
   * @returns Updated user.
   */
  async updateUserProfile(
    userId: string,
    dto: UpdateUserProfileDto,
  ): Promise<UserDto> {
    const validationResult = updateUserProfileSchema.safeParse(dto);

    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const updatedUser = await this.userRepository.updateProfile(userId, {
      name: validationResult.data.name,
    });

    await auditLogService
      .logAction("Updated", "User", userId, userId, {
        newValues: {
          name: updatedUser.name,
        },
      })
      .catch((err) => {
        console.error("Failed to log profile update:", err);
      });

    return updatedUser;
  }

  /**
   * Changes the current user's password.
   * @param userId - User id.
   * @param dto - Password change input.
   */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const validationResult = changePasswordSchema.safeParse(dto);

    if (!validationResult.success) {
      const issues = validationResult.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new ValidationError("Validation failed", issues);
    }

    const userWithPassword =
      await this.userRepository.findByIdWithPassword(userId);

    if (!userWithPassword) {
      throw new UnauthorizedError("Authentication required");
    }

    const isPasswordValid = await this.verifyPassword(
      validationResult.data.currentPassword,
      userWithPassword.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid current password");
    }

    const hashedPassword = await this.hashPassword(
      validationResult.data.newPassword,
    );

    await this.userRepository.updatePassword(userId, hashedPassword);

    await auditLogService
      .logAction("Updated", "User", userId, userId, {
        newValues: {
          password: "[REDACTED]",
        },
      })
      .catch((err) => {
        console.error("Failed to log password change:", err);
      });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  private hashResetToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}

/**
 * Default AuthService singleton.
 * @returns A shared AuthService instance.
 */
export const authService = new AuthService(userRepository);

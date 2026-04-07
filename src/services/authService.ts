import bcrypt from "bcryptjs";
import type { IUserRepository } from "@/domain/interfaces/IUserRepository";
import type { RegisterDto } from "@/domain/dtos/RegisterDto";
import type { UserDto } from "@/domain/dtos/UserDto";
import { loginSchema, registerSchema } from "@/domain/validations/authSchema";
import {
  EmailExistsError,
  ValidationError,
  UnauthorizedError,
} from "@/domain/errors/DomainErrors";
import { userRepository } from "@/repositories/userRepository";
import { auditLogService } from "./auditLogService";

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

    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

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

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

/**
 * Default AuthService singleton.
 * @returns A shared AuthService instance.
 */
export const authService = new AuthService(userRepository);

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

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

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

export const authService = new AuthService(userRepository);

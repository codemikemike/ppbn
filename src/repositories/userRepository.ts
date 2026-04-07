import { db } from "@/lib/db";
import type { IUserRepository } from "@/domain/interfaces/IUserRepository";
import type { UserDto } from "@/domain/dtos/UserDto";
import type { CreateUserData } from "@/domain/dtos/CreateUserData";
import type { PasswordResetUserDto } from "@/domain/dtos/PasswordResetUserDto";
import type { User } from "@/generated/prisma";

function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function toPasswordResetUserDto(user: {
  id: string;
  passwordResetExpiry: Date | null;
}): PasswordResetUserDto {
  return {
    id: user.id,
    passwordResetExpiry: user.passwordResetExpiry,
  };
}

/**
 * User repository backed by Prisma.
 * @returns An IUserRepository implementation.
 */
export const userRepository: IUserRepository = {
  /**
   * Finds an active (not soft-deleted) user by email.
   * @param email - User email.
   * @returns The user DTO, or null if not found or soft-deleted.
   */
  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) return null;

    return toUserDto(user);
  },

  /**
   * Finds an active (not soft-deleted) user by id.
   * @param id - User id.
   * @returns The user DTO, or null if not found.
   */
  async findById(id: string): Promise<UserDto | null> {
    const user = await db.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) return null;

    return toUserDto(user);
  },

  /**
   * Creates a new user.
   * @param data - User creation data.
   * @returns The created user DTO.
   */
  async create(data: CreateUserData): Promise<UserDto> {
    const user = await db.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
        password: data.password,
        role: data.role,
      },
    });

    return toUserDto(user);
  },

  /**
   * Finds an active user by email and includes their password hash for authentication.
   * @param email - User email.
   * @returns The user DTO plus password hash, or null if not found or soft-deleted.
   */
  async findByEmailWithPassword(
    email: string,
  ): Promise<(UserDto & { password: string }) | null> {
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) return null;

    return {
      ...toUserDto(user),
      password: user.password,
    };
  },

  /**
   * Stores a password reset token hash and expiry for an active (not soft-deleted) user.
   * @param userId - User id.
   * @param tokenHash - Password reset token hash.
   * @param expiry - Expiry timestamp.
   */
  async setResetToken(userId: string, tokenHash: string, expiry: Date) {
    await db.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        passwordResetToken: tokenHash,
        passwordResetExpiry: expiry,
      },
    });
  },

  /**
   * Finds a user by password reset token hash.
   * @param tokenHash - Password reset token hash.
   * @returns The password reset lookup DTO, or null if not found.
   */
  async findByResetToken(
    tokenHash: string,
  ): Promise<PasswordResetUserDto | null> {
    const user = await db.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        deletedAt: null,
      },
      select: {
        id: true,
        passwordResetExpiry: true,
      },
    });

    if (!user) return null;

    return toPasswordResetUserDto(user);
  },

  /**
   * Updates a user's password hash and invalidates any stored reset token.
   * @param userId - User id.
   * @param passwordHash - New password hash.
   */
  async updatePassword(userId: string, passwordHash: string): Promise<void> {
    await db.user.updateMany({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        password: passwordHash,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    });
  },
};

import { db } from "@/lib/db";
import type { IUserRepository } from "@/domain/interfaces/IUserRepository";
import type { UserDto } from "@/domain/dtos/UserDto";
import type { CreateUserData } from "@/domain/dtos/CreateUserData";
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
};

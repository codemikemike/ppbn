import { db } from "@/lib/db";
import type { IUserRepository } from "@/domain/interfaces/IUserRepository";
import type { UserDto } from "@/domain/dtos/UserDto";
import type { CreateUserData } from "@/domain/dtos/CreateUserData";
import type { PasswordResetUserDto } from "@/domain/dtos/PasswordResetUserDto";
import type { DashboardStatsDto } from "@/domain/dtos/DashboardStatsDto";
import type { UserReviewListItemDto } from "@/domain/dtos/UserReviewListItemDto";
import type { UpdateUserProfileDto } from "@/domain/dtos/UpdateUserProfileDto";
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
   * Finds an active user by id and includes their password hash.
   * @param id - User id.
   * @returns The user DTO plus password hash, or null if not found.
   */
  async findByIdWithPassword(
    id: string,
  ): Promise<(UserDto & { password: string }) | null> {
    const user = await db.user.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) return null;

    return {
      ...toUserDto(user),
      password: user.password,
    };
  },

  /**
   * Updates the user's profile (name).
   * @param userId - User id.
   * @param data - Profile update data.
   * @returns Updated user DTO.
   */
  async updateProfile(
    userId: string,
    data: UpdateUserProfileDto,
  ): Promise<UserDto> {
    const user = await db.user.update({
      where: {
        id: userId,
        deletedAt: null,
      },
      data: {
        name: data.name,
      },
    });

    return toUserDto(user);
  },

  /**
   * Returns dashboard stats counts for the given user.
   * @param userId - User id.
   */
  async getDashboardStats(userId: string): Promise<DashboardStatsDto> {
    const [reviewsCount, favoriteBarsCount, staffRatingsCount] =
      await Promise.all([
        db.review.count({
          where: {
            userId,
            deletedAt: null,
          },
        }),
        db.favoriteBar.count({
          where: {
            userId,
          },
        }),
        db.staffRating.count({
          where: {
            userId,
          },
        }),
      ]);

    return {
      reviewsCount,
      favoriteBarsCount,
      staffRatingsCount,
    };
  },

  /**
   * Lists the current user's reviews with minimal bar information.
   * @param userId - User id.
   */
  async listMyReviews(userId: string): Promise<UserReviewListItemDto[]> {
    const reviews = await db.review.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        bar: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      createdAt: review.createdAt,
      bar: {
        slug: review.bar.slug,
        name: review.bar.name,
      },
    }));
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

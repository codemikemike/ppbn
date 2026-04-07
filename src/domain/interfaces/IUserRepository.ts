import type { UserDto } from "../dtos/UserDto";
import type { CreateUserData } from "../dtos/CreateUserData";
import type { PasswordResetUserDto } from "../dtos/PasswordResetUserDto";

/**
 * Contract for user persistence and lookup.
 */
export interface IUserRepository {
  /**
   * Finds an active (not soft-deleted) user by email.
   * @param email - User email.
   * @returns The user DTO, or null if not found.
   */
  findByEmail(email: string): Promise<UserDto | null>;

  /**
   * Finds an active (not soft-deleted) user by id.
   * @param id - User id.
   * @returns The user DTO, or null if not found.
   */
  findById(id: string): Promise<UserDto | null>;

  /**
   * Creates a new user.
   * @param data - User creation data.
   * @returns The created user DTO.
   */
  create(data: CreateUserData): Promise<UserDto>;

  /**
   * Finds an active user by email and includes password hash for authentication.
   * @param email - User email.
   * @returns The user DTO plus password hash, or null if not found.
   */
  findByEmailWithPassword(
    email: string,
  ): Promise<(UserDto & { password: string }) | null>;

  /**
   * Stores a password reset token hash and expiry for an active (not soft-deleted) user.
   *
   * The token value should be a hash (not the raw token) to reduce impact if the database is leaked.
   *
   * @param userId - User id.
   * @param tokenHash - Password reset token hash.
   * @param expiry - Expiry timestamp.
   */
  setResetToken(userId: string, tokenHash: string, expiry: Date): Promise<void>;

  /**
   * Finds a user by password reset token hash.
   * @param tokenHash - Password reset token hash.
   * @returns The password reset lookup DTO, or null if not found.
   */
  findByResetToken(tokenHash: string): Promise<PasswordResetUserDto | null>;

  /**
   * Updates a user's password hash and invalidates any stored reset token.
   * @param userId - User id.
   * @param passwordHash - New password hash.
   */
  updatePassword(userId: string, passwordHash: string): Promise<void>;
}

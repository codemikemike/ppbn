import type { UserDto } from "../dtos/UserDto";
import type { CreateUserData } from "../dtos/CreateUserData";

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
}

import type { UserDto } from "../dtos/UserDto";
import type { CreateUserData } from "../dtos/CreateUserData";

export interface IUserRepository {
  findByEmail(email: string): Promise<UserDto | null>;
  findById(id: string): Promise<UserDto | null>;
  create(data: CreateUserData): Promise<UserDto>;
  findByEmailWithPassword(
    email: string,
  ): Promise<(UserDto & { password: string }) | null>;
}

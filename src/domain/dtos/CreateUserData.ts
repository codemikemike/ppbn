import type { UserRole } from "./UserRole";

export type CreateUserData = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

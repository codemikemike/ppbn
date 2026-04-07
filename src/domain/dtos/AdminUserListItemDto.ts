import type { UserRole } from "./UserRole";

/**
 * Admin list row for a user.
 */
export type AdminUserListItemDto = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  deletedAt: Date | null;
  createdAt: Date;
};

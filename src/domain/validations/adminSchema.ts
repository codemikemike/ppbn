import { z } from "zod";

import type { UserRole } from "../dtos/UserRole";

/**
 * Validation schema for approve/reject operations.
 */
export const approveSchema = z.object({
  approved: z.boolean(),
});

export type ApproveInput = z.infer<typeof approveSchema>;

/**
 * Validation schema for publish/unpublish operations.
 */
export const publishSchema = z.object({
  published: z.boolean(),
});

export type PublishInput = z.infer<typeof publishSchema>;

const assignableRoles = [
  "Visitor",
  "BarOwner",
  "BlogWriter",
  "Admin",
] as const satisfies readonly UserRole[];

/**
 * Validation schema for updating a user's role.
 */
export const updateUserRoleSchema = z.object({
  role: z.enum(assignableRoles),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

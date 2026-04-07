import { z } from "zod";

import { passwordSchema } from "./authSchema";

/**
 * Validation schema for updating a user's profile.
 */
export const updateUserProfileSchema = z.object({
  name: z.union([
    z.string().trim().min(1, "Name is required").max(100),
    z.null(),
  ]),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;

/**
 * Validation schema for changing a password.
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required").max(72),
  newPassword: passwordSchema,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

import { z } from "zod";

/**
 * Validation schema for rating a staff profile.
 */
export const rateStaffSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

/**
 * Validation schema for tipping a staff profile.
 */
export const tipStaffSchema = z.object({
  amount: z.number().min(1).max(100),
  message: z.string().optional(),
});

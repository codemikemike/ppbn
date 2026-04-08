export const createStaffProfileSchema = z.object({
  displayName: z.string().min(2).max(64),
  bio: z.string().min(10).max(1000),
  barId: z.string().max(64).optional(),
  imageUrl: z.string().url().max(256).optional(),
  isActive: z.boolean().optional(),
});
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

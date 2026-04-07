import { z } from "zod";

/**
 * Validation schema for rating a staff profile.
 */
export const rateStaffSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

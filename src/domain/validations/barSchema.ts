import { z } from "zod";

/**
 * Validates input for rating a bar.
 */
export const rateBarSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});

/**
 * TypeScript type inferred from `rateBarSchema`.
 */
export type RateBarInput = z.infer<typeof rateBarSchema>;

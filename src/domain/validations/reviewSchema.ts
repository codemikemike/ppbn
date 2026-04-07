import { z } from "zod";

/**
 * Validates input for submitting a bar review.
 */
export const submitReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .trim()
    .min(10, "Comment must be at least 10 characters")
    .max(5000, "Comment must be less than 5000 characters"),
});

/**
 * TypeScript type inferred from `submitReviewSchema`.
 */
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;

import { z } from "zod";

/**
 * Validation schema for creating a blog post comment.
 */
export const createBlogCommentSchema = z.object({
  content: z.string().trim().min(5),
});

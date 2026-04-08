/**
 * Validation schema for creating a blog post (admin).
 */
export const createBlogPostSchema = z.object({
  title: z.string().min(3).max(128),
  content: z.string().min(10),
  excerpt: z.string().max(256).optional(),
  category: z.string().max(64).optional(),
  tags: z.array(z.string().max(32)).optional(),
  imageUrl: z.string().url().max(256).optional(),
});
import { z } from "zod";

/**
 * Validation schema for creating a blog post comment.
 */
export const createBlogCommentSchema = z.object({
  content: z.string().trim().min(5),
});

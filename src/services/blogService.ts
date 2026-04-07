import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";
import type {
  IBlogRepository,
  PublishedBlogPostFilters,
} from "@/domain/interfaces/IBlogRepository";
import { blogRepository } from "@/repositories/blogRepository";

export type BlogService = {
  /**
   * Lists published blog posts.
   * @param page Page number (1-indexed).
   * @param limit Page size.
   */
  listPublishedPosts: (page?: number, limit?: number) => Promise<BlogPostDto[]>;
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const normalizePublishedPostFilters = (
  page?: number,
  limit?: number,
): PublishedBlogPostFilters => {
  const normalizedPage =
    typeof page === "number" && Number.isFinite(page) && page >= 1
      ? Math.floor(page)
      : DEFAULT_PAGE;

  const normalizedLimit =
    typeof limit === "number" && Number.isFinite(limit) && limit >= 1
      ? Math.min(MAX_LIMIT, Math.floor(limit))
      : DEFAULT_LIMIT;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
  };
};

/**
 * Creates a blog service using the given repository.
 * @param repo Repository implementation.
 */
export const createBlogService = (repo: IBlogRepository): BlogService => ({
  listPublishedPosts: async (page?: number, limit?: number) => {
    const filters = normalizePublishedPostFilters(page, limit);
    return repo.findAllPublished(filters);
  },
});

/**
 * Default blog service.
 */
export const blogService = createBlogService(blogRepository);

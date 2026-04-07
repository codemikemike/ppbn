import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";
import type { CommentDto } from "@/domain/dtos/CommentDto";
import type {
  IBlogRepository,
  PublishedBlogPostFilters,
} from "@/domain/interfaces/IBlogRepository";
import { blogRepository } from "@/repositories/blogRepository";
import { NotFoundError } from "@/domain/errors/DomainErrors";

/**
 * Blog service contract.
 */
export type BlogService = {
  /**
   * Lists published blog posts.
   * @param page Page number (1-indexed).
   * @param limit Page size.
   */
  listPublishedPosts: (page?: number, limit?: number) => Promise<BlogPostDto[]>;

  /**
   * Gets a single published post by slug.
   * @param slug Post slug.
   * @throws NotFoundError when the post does not exist or is not published.
   */
  getPublishedPostBySlug: (slug: string) => Promise<BlogPostDto>;

  /**
   * Lists approved comments for a published blog post.
   * @param slug Post slug.
   */
  getComments: (slug: string) => Promise<CommentDto[]>;

  /**
   * Adds a comment to a published blog post.
   * @param slug Post slug.
   * @param userId User id.
   * @param content Comment content.
   */
  addComment: (
    slug: string,
    userId: string,
    content: string,
  ) => Promise<CommentDto | null>;
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
 * @returns Blog service implementation.
 */
export const createBlogService = (repo: IBlogRepository): BlogService => ({
  listPublishedPosts: async (page?: number, limit?: number) => {
    const filters = normalizePublishedPostFilters(page, limit);
    return repo.findAllPublished(filters);
  },
  getPublishedPostBySlug: async (slug: string) => {
    const post = await repo.findBySlug(slug);
    if (!post) {
      throw new NotFoundError("Blog post not found");
    }
    return post;
  },

  getComments: async (slug: string) => {
    const post = await repo.findBySlug(slug);
    if (!post) {
      throw new NotFoundError("Blog post not found");
    }

    return repo.findCommentsBySlug(slug);
  },

  addComment: async (slug: string, userId: string, content: string) => {
    const post = await repo.findBySlug(slug);
    if (!post) return null;

    return repo.createComment(slug, userId, content);
  },
});

/**
 * Default blog service.
 */
export const blogService = createBlogService(blogRepository);

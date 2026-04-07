import type { BlogPostDto } from "../dtos/BlogPostDto";
import type { CommentDto } from "../dtos/CommentDto";

/**
 * Filters for listing published blog posts.
 */
export type PublishedBlogPostFilters = {
  page: number;
  limit: number;
};

/**
 * Contract for published blog post listing.
 */
export interface IBlogRepository {
  /**
   * Lists published, not-deleted blog posts using pagination.
   * @param filters Pagination filters.
   */
  findAllPublished(filters: PublishedBlogPostFilters): Promise<BlogPostDto[]>;

  /**
   * Finds a single published, not-deleted blog post by slug.
   * @param slug Post slug.
   */
  findBySlug(slug: string): Promise<BlogPostDto | null>;

  /**
   * Lists approved comments for a published blog post.
   * @param slug Post slug.
   */
  findCommentsBySlug: (slug: string) => Promise<CommentDto[]>;

  /**
   * Creates a blog comment for a published blog post.
   * @param slug Post slug.
   * @param userId User id.
   * @param content Comment content.
   */
  createComment: (
    slug: string,
    userId: string,
    content: string,
  ) => Promise<CommentDto>;
}

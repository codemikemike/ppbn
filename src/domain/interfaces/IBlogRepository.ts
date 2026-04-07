import type { BlogPostDto } from "../dtos/BlogPostDto";

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
}

/**
 * Admin list row for a blog post.
 */
export type AdminBlogPostListItemDto = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  publishedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
};

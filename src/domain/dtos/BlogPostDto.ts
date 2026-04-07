/**
 * Public blog post representation for list and detail views.
 */
export type BlogPostDto = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  authorName: string | null;
  publishedAt: Date;
  category: string | null;
  tags: string[];
  imageUrl: string | null;
};

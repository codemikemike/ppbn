export type CreateBlogPostData = {
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
};

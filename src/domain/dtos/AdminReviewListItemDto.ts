/**
 * Admin list row for a review.
 */
export type AdminReviewListItemDto = {
  id: string;
  rating: number;
  content: string;
  isApproved: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  bar: {
    id: string;
    slug: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
  };
};

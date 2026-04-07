/**
 * A single review row shown in the user's dashboard reviews list.
 */
export type UserReviewListItemDto = {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: Date;
  bar: {
    slug: string;
    name: string;
  };
};

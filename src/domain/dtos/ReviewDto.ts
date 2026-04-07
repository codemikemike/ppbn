/**
 * Public review representation for display and API responses.
 */
export type ReviewDto = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string | null;
};

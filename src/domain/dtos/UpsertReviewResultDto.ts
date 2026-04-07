/**
 * Review data returned after an upsert operation.
 */
export type UpsertReviewResultDto = {
  /**
   * Review id.
   */
  id: string;

  /**
   * Star rating (1-5).
   */
  rating: number;

  /**
   * Review comment content.
   */
  comment: string;

  /**
   * Review creation timestamp.
   */
  createdAt: Date;

  /**
   * Review last update timestamp.
   */
  updatedAt: Date;
};

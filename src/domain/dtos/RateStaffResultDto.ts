/**
 * Result returned after rating a staff profile.
 */
export type RateStaffResultDto = {
  /**
   * The staff profile's updated average rating after the upsert.
   */
  averageRating: number;

  /**
   * The current user's rating value (1-5).
   */
  userRating: number;
};

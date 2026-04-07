import type { BarArea } from "./BarArea";
import type { BarCategory } from "./BarCategory";

/**
 * Public bar representation for listing and map views.
 */
export type BarDto = {
  id: string;
  slug: string;
  name: string;
  area: BarArea;
  category: BarCategory;
  isFeatured: boolean;

  /**
   * Average rating across approved, non-deleted reviews.
   *
   * When there are no ratings, this is null.
   */
  averageRating: number | null;

  /**
   * Optional bar latitude.
   */
  latitude?: number;

  /**
   * Optional bar longitude.
   */
  longitude?: number;
};

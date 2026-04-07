import type { BarDto } from "../dtos/BarDto";
import type { BarDetailDto } from "../dtos/BarDetailDto";
import type { BarArea } from "../dtos/BarArea";
import type { BarCategory } from "../dtos/BarCategory";
import type { RateBarResultDto } from "../dtos/RateBarResultDto";
import type { ToggleFavoriteResultDto } from "../dtos/ToggleFavoriteResultDto";
import type { UpsertReviewResultDto } from "../dtos/UpsertReviewResultDto";

/**
 * Optional filters for listing publicly visible bars.
 */
export type BarListFilters = {
  area?: BarArea;
  category?: BarCategory;

  /**
   * Case-insensitive substring match on bar name or description.
   */
  search?: string;
};

/**
 * Bar repository contract.
 */
export interface IBarRepository {
  /**
   * Lists approved, non-deleted bars with optional filters.
   * @param filters Optional area/category filters.
   */
  findAll(filters?: BarListFilters): Promise<BarDto[]>;

  /**
   * Finds a single approved, non-deleted bar by slug.
   * @param slug Bar slug.
   */
  findBySlug(slug: string): Promise<BarDetailDto | null>;

  /**
   * Lists approved, non-deleted featured bars.
   */
  findFeaturedBars(): Promise<BarDto[]>;

  /**
   * Lists approved, non-deleted bars by ids.
   * @param ids Bar ids.
   */
  findByIds(ids: string[]): Promise<BarDto[]>;

  /**
   * Lists approved, non-deleted bars that are open at the given time.
   * @param dateTime Date/time to evaluate against `openingHours`.
   */
  findOpenBarsAt(dateTime: Date): Promise<BarDto[]>;

  /**
   * Upserts a user's rating for a bar.
   *
   * @param barId Bar id.
   * @param userId User id.
   * @param rating Rating in range 1-5.
   */
  upsertRating(
    barId: string,
    userId: string,
    rating: number,
  ): Promise<RateBarResultDto>;

  /**
   * Upserts a user's review for a bar.
   *
   * @param barId Bar id.
   * @param userId User id.
   * @param rating Rating in range 1-5.
   * @param comment Review comment content.
   */
  upsertReview(
    barId: string,
    userId: string,
    rating: number,
    comment: string,
  ): Promise<UpsertReviewResultDto>;

  /**
   * Toggles whether a bar is favorited for the user.
   *
   * @param barId Bar id.
   * @param userId User id.
   */
  toggleFavorite(
    barId: string,
    userId: string,
  ): Promise<ToggleFavoriteResultDto>;

  /**
   * Lists the user's favorite bars.
   *
   * @param userId User id.
   */
  findUserFavorites(userId: string): Promise<BarDto[]>;
}

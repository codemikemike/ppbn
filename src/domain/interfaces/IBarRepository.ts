import type { BarDto } from "../dtos/BarDto";
import type { BarDetailDto } from "../dtos/BarDetailDto";
import type { BarArea } from "../dtos/BarArea";
import type { BarCategory } from "../dtos/BarCategory";

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
}

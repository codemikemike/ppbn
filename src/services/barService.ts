import type { BarDto } from "@/domain/dtos/BarDto";
import type { BarDetailDto } from "@/domain/dtos/BarDetailDto";
import type {
  BarListFilters,
  IBarRepository,
} from "@/domain/interfaces/IBarRepository";
import { barRepository } from "@/repositories/barRepository";

export type BarService = {
  listApprovedBars: (filters?: BarListFilters) => Promise<BarDto[]>;
  getApprovedBarBySlug: (slug: string) => Promise<BarDetailDto | null>;
};

/**
 * Creates a bar service using the given repository.
 * @param repo Repository implementation.
 */
export const createBarService = (repo: IBarRepository): BarService => ({
  listApprovedBars: async (filters?: BarListFilters) => {
    const normalizedSearch = filters?.search?.trim();

    return repo.findAll({
      ...filters,
      ...(normalizedSearch
        ? { search: normalizedSearch }
        : { search: undefined }),
    });
  },
  getApprovedBarBySlug: async (slug: string) => repo.findBySlug(slug),
});

/**
 * Default bar service.
 */
export const barService = createBarService(barRepository);

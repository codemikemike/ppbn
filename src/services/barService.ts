import type { BarDto } from "@/domain/dtos/BarDto";
import type { BarDetailDto } from "@/domain/dtos/BarDetailDto";
import type { ReviewDto } from "@/domain/dtos/ReviewDto";
import type {
  BarListFilters,
  IBarRepository,
} from "@/domain/interfaces/IBarRepository";
import { barRepository } from "@/repositories/barRepository";

export type BarService = {
  listApprovedBars: (filters?: BarListFilters) => Promise<BarDto[]>;
  getApprovedBarBySlug: (slug: string) => Promise<BarDetailDto | null>;
  listApprovedReviewsByBarSlug: (slug: string) => Promise<ReviewDto[] | null>;
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
  listApprovedReviewsByBarSlug: async (slug: string) => {
    const bar = await repo.findBySlug(slug);
    if (!bar) return null;

    return bar.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.content,
      createdAt: review.createdAt,
      userName: review.user.name,
    }));
  },
});

/**
 * Default bar service.
 */
export const barService = createBarService(barRepository);

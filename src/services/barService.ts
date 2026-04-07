import type { BarDto } from "@/domain/dtos/BarDto";
import type { BarDetailDto } from "@/domain/dtos/BarDetailDto";
import type { IBarRepository } from "@/domain/interfaces/IBarRepository";
import { barRepository } from "@/repositories/barRepository";

export type BarService = {
  listApprovedBars: () => Promise<BarDto[]>;
  getApprovedBarBySlug: (slug: string) => Promise<BarDetailDto | null>;
};

export const createBarService = (repo: IBarRepository): BarService => ({
  listApprovedBars: async () => repo.findApproved(),
  getApprovedBarBySlug: async (slug: string) => repo.findBySlug(slug),
});

export const barService = createBarService(barRepository);

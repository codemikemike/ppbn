import type { BarDto } from "@/domain/dtos/BarDto";
import type { IBarRepository } from "@/domain/interfaces/IBarRepository";
import { barRepository } from "@/repositories/barRepository";

export type BarService = {
  listApprovedBars: () => Promise<BarDto[]>;
};

export const createBarService = (repo: IBarRepository): BarService => ({
  listApprovedBars: async () => repo.findApproved(),
});

export const barService = createBarService(barRepository);

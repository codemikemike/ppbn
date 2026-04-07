import type { BarDto } from "../dtos/BarDto";
import type { BarDetailDto } from "../dtos/BarDetailDto";

export interface IBarRepository {
  findApproved(): Promise<BarDto[]>;

  findBySlug(slug: string): Promise<BarDetailDto | null>;
}

import type { BarDto } from "../dtos/BarDto";

export interface IBarRepository {
  findApproved(): Promise<BarDto[]>;
}

import type {
  StaffProfileDetailDto,
  StaffProfileDto,
} from "@/domain/dtos/StaffProfileDto";
import { NotFoundError } from "@/domain/errors/DomainErrors";
import type { IStaffRepository } from "@/domain/interfaces/IStaffRepository";
import { staffRepository } from "@/repositories/staffRepository";

export type StaffService = {
  /**
   * Lists approved and active staff profiles.
   * @param bar Optional bar name filter.
   */
  listApprovedStaffProfiles: (bar?: string) => Promise<StaffProfileDto[]>;

  /**
   * Gets a single approved and active staff profile by id.
   * @param id Staff profile id.
   * @throws NotFoundError when profile does not exist or is not publicly visible.
   */
  getApprovedStaffProfileById: (id: string) => Promise<StaffProfileDetailDto>;
};

const normalizeBarFilter = (bar?: string): string | undefined => {
  const trimmed = bar?.trim();
  if (!trimmed) return undefined;
  return trimmed;
};

/**
 * Creates a staff service using the given repository.
 * @param repo Repository implementation.
 */
export const createStaffService = (repo: IStaffRepository): StaffService => ({
  listApprovedStaffProfiles: async (bar?: string) => {
    const normalizedBar = normalizeBarFilter(bar);
    return repo.findAllApproved({ bar: normalizedBar });
  },
  getApprovedStaffProfileById: async (id: string) => {
    const profile = await repo.findApprovedById(id);
    if (!profile) {
      throw new NotFoundError("Staff profile not found");
    }
    return profile;
  },
});

/**
 * Default staff service.
 */
export const staffService = createStaffService(staffRepository);

import type {
  StaffProfileDetailDto,
  StaffProfileDto,
} from "@/domain/dtos/StaffProfileDto";
import type { RateStaffResultDto } from "@/domain/dtos/RateStaffResultDto";
import { NotFoundError } from "@/domain/errors/DomainErrors";
import type { IStaffRepository } from "@/domain/interfaces/IStaffRepository";
import { staffRepository } from "@/repositories/staffRepository";

/**
 * Staff service contract.
 */
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

  /**
   * Rates a staff profile.
   * @param staffProfileId Staff profile id.
   * @param userId User id.
   * @param rating Rating value (1-5).
   */
  rateStaff: (
    staffProfileId: string,
    userId: string,
    rating: number,
  ) => Promise<RateStaffResultDto | null>;

  /**
   * Gets the current user's rating for a staff profile.
   * @param staffProfileId Staff profile id.
   * @param userId User id.
   */
  getUserRating: (
    staffProfileId: string,
    userId: string,
  ) => Promise<number | null>;
};

const normalizeBarFilter = (bar?: string): string | undefined => {
  const trimmed = bar?.trim();
  if (!trimmed) return undefined;
  return trimmed;
};

/**
 * Creates a staff service using the given repository.
 * @param repo Repository implementation.
 * @returns Staff service implementation.
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

  rateStaff: async (staffProfileId: string, userId: string, rating: number) => {
    const profile = await repo.findApprovedById(staffProfileId);
    if (!profile) return null;

    return repo.upsertRating(staffProfileId, userId, rating);
  },

  getUserRating: async (staffProfileId: string, userId: string) =>
    repo.getUserRating(staffProfileId, userId),
});

/**
 * Default staff service.
 */
export const staffService = createStaffService(staffRepository);

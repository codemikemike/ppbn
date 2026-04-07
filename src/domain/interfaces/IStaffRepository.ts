import type {
  StaffProfileDetailDto,
  StaffProfileDto,
} from "../dtos/StaffProfileDto";
import type { RateStaffResultDto } from "../dtos/RateStaffResultDto";

/**
 * Approved staff profile filters.
 */
export type ApprovedStaffProfileFilters = {
  bar?: string;
};

/**
 * Staff repository contract.
 */
export type IStaffRepository = {
  /**
   * Lists approved and active staff profiles.
   * @param filters Optional filters.
   */
  findAllApproved: (
    filters: ApprovedStaffProfileFilters,
  ) => Promise<StaffProfileDto[]>;

  /**
   * Finds a single approved and active staff profile by id.
   * @param id Staff profile id.
   */
  findApprovedById: (id: string) => Promise<StaffProfileDetailDto | null>;

  /**
   * Upserts the user's rating for the staff profile and returns rating metadata.
   * @param staffProfileId Staff profile id.
   * @param userId User id.
   * @param rating Rating value (1-5).
   */
  upsertRating: (
    staffProfileId: string,
    userId: string,
    rating: number,
  ) => Promise<RateStaffResultDto>;

  /**
   * Gets the user's existing rating for a staff profile.
   * @param staffProfileId Staff profile id.
   * @param userId User id.
   */
  getUserRating: (
    staffProfileId: string,
    userId: string,
  ) => Promise<number | null>;
};

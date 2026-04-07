import type {
  StaffProfileDetailDto,
  StaffProfileDto,
} from "../dtos/StaffProfileDto";

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
};

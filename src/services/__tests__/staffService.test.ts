import { beforeAll, describe, expect, it, vi } from "vitest";

import type {
  StaffProfileDetailDto,
  StaffProfileDto,
} from "@/domain/dtos/StaffProfileDto";
import { NotFoundError } from "@/domain/errors/DomainErrors";

const findAllApprovedMock = vi.fn();
const findApprovedByIdMock = vi.fn();

vi.mock("@/repositories/staffRepository", () => {
  return {
    staffRepository: {
      findAllApproved: findAllApprovedMock,
      findApprovedById: findApprovedByIdMock,
    },
  };
});

let staffService: typeof import("../staffService").staffService;

beforeAll(async () => {
  ({ staffService } = await import("../staffService"));
});

describe("staffService.listApprovedStaffProfiles", () => {
  it("passes the bar filter to the repository", async () => {
    const profiles: StaffProfileDto[] = [
      {
        id: "sp_1",
        displayName: "Sok Dara",
        bio: null,
        photoUrl: null,
        photoAlt: null,
        currentBar: "Rose Bar",
        position: "Bartender",
        averageRating: 4.5,
        ratingCount: 2,
      },
    ];

    findAllApprovedMock.mockResolvedValueOnce(profiles);

    const result = await staffService.listApprovedStaffProfiles("  Rose Bar  ");

    expect(result).toEqual(profiles);
    expect(findAllApprovedMock).toHaveBeenCalledWith({ bar: "Rose Bar" });
  });
});

describe("staffService.getApprovedStaffProfileById", () => {
  it("returns a profile when found", async () => {
    const profile: StaffProfileDetailDto = {
      id: "sp_1",
      displayName: "Sok Dara",
      bio: "Friendly bartender",
      photoUrl: null,
      photoAlt: null,
      currentBar: "Rose Bar",
      position: "Bartender",
      averageRating: 4.5,
      ratingCount: 2,
      galleryImageUrls: [],
      ratings: [],
    };

    findApprovedByIdMock.mockResolvedValueOnce(profile);

    await expect(
      staffService.getApprovedStaffProfileById("sp_1"),
    ).resolves.toEqual(profile);
  });

  it("throws NotFoundError when missing", async () => {
    findApprovedByIdMock.mockResolvedValueOnce(null);

    await expect(
      staffService.getApprovedStaffProfileById("missing"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

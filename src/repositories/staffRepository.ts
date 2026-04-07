import { db } from "@/lib/db";
import type {
  StaffProfileDetailDto,
  StaffProfileDto,
  StaffRatingDto,
} from "@/domain/dtos/StaffProfileDto";
import type {
  ApprovedStaffProfileFilters,
  IStaffRepository,
} from "@/domain/interfaces/IStaffRepository";
import type { StaffProfile, StaffRating } from "@/generated/prisma";

const toStaffProfileDto = (
  profile: StaffProfile,
  averageRating: number | null,
  ratingCount: number,
): StaffProfileDto => {
  return {
    id: profile.id,
    displayName: profile.displayName,
    bio: profile.bio,
    photoUrl: profile.photoUrl ?? null,
    photoAlt: profile.photoAlt ?? null,
    currentBar: profile.currentBar ?? null,
    position: profile.position ?? null,
    averageRating,
    ratingCount,
  };
};

const toStaffRatingDto = (
  rating: StaffRating & { user: { name: string | null } },
): StaffRatingDto => {
  return {
    id: rating.id,
    rating: rating.rating,
    comment: rating.comment ?? null,
    createdAt: rating.createdAt,
    userName: rating.user.name,
  };
};

const normalizeBarFilter = (bar?: string): string | undefined => {
  const trimmed = bar?.trim();
  if (!trimmed) return undefined;
  return trimmed;
};

/**
 * Staff repository backed by Prisma.
 */
export const staffRepository: IStaffRepository = {
  /**
   * Lists approved and active staff profiles.
   * @param filters Optional filters.
   */
  async findAllApproved(
    filters: ApprovedStaffProfileFilters,
  ): Promise<StaffProfileDto[]> {
    const barFilter = normalizeBarFilter(filters.bar);

    const profiles = await db.staffProfile.findMany({
      where: {
        isApproved: true,
        isActive: true,
        deletedAt: null,
        ...(barFilter ? { currentBar: barFilter } : {}),
      },
      orderBy: [{ displayName: "asc" }],
    });

    if (profiles.length === 0) return [];

    const aggregates = await db.staffRating.groupBy({
      by: ["staffProfileId"],
      where: {
        staffProfileId: {
          in: profiles.map((p) => p.id),
        },
      },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    const aggregateByProfileId = new Map(
      aggregates.map((row) => [
        row.staffProfileId,
        {
          averageRating: row._avg.rating ?? null,
          ratingCount: row._count._all,
        },
      ]),
    );

    return profiles.map((profile) => {
      const agg = aggregateByProfileId.get(profile.id);
      return toStaffProfileDto(
        profile,
        agg?.averageRating ?? null,
        agg?.ratingCount ?? 0,
      );
    });
  },

  /**
   * Finds an approved and active staff profile by id.
   * @param id Staff profile id.
   */
  async findApprovedById(id: string): Promise<StaffProfileDetailDto | null> {
    const profile = await db.staffProfile.findFirst({
      where: {
        id,
        isApproved: true,
        isActive: true,
        deletedAt: null,
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    if (!profile) return null;

    const ratings = profile.ratings.map((r) => toStaffRatingDto(r));

    const ratingCount = ratings.length;
    const averageRating =
      ratingCount === 0
        ? null
        : ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount;

    const base = toStaffProfileDto(profile, averageRating, ratingCount);

    const galleryImageUrls = profile.photoUrl ? [profile.photoUrl] : [];

    return {
      ...base,
      galleryImageUrls,
      ratings,
    };
  },

  /**
   * Upserts a user's rating for a staff profile.
   * @param staffProfileId Staff profile id.
   * @param userId User id.
   * @param rating Rating value (1-5).
   */
  async upsertRating(staffProfileId: string, userId: string, rating: number) {
    await db.staffRating.upsert({
      where: {
        staffProfileId_userId: {
          staffProfileId,
          userId,
        },
      },
      update: {
        rating,
      },
      create: {
        staffProfileId,
        userId,
        rating,
      },
      select: {
        id: true,
      },
    });

    const aggregate = await db.staffRating.aggregate({
      where: {
        staffProfileId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    const averageRating = aggregate._avg.rating ?? rating;

    return {
      averageRating,
      userRating: rating,
    };
  },

  /**
   * Gets the user's existing rating for a staff profile.
   * @param staffProfileId Staff profile id.
   * @param userId User id.
   */
  async getUserRating(
    staffProfileId: string,
    userId: string,
  ): Promise<number | null> {
    const rating = await db.staffRating.findUnique({
      where: {
        staffProfileId_userId: {
          staffProfileId,
          userId,
        },
      },
      select: {
        rating: true,
      },
    });

    return rating?.rating ?? null;
  },
};

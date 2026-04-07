import { db } from "@/lib/db";
import type { BarDto } from "@/domain/dtos/BarDto";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";
import type {
  BarDetailDto,
  BarImageSummaryDto,
  BarReviewSummaryDto,
} from "@/domain/dtos/BarDetailDto";
import type {
  BarListFilters,
  IBarRepository,
} from "@/domain/interfaces/IBarRepository";
import type { Bar } from "@/generated/prisma";

const toBarDto = (bar: Bar, averageRating: number | null): BarDto => ({
  id: bar.id,
  slug: bar.slug,
  name: bar.name,
  area: bar.area as unknown as BarArea,
  category: bar.category as unknown as BarCategory,
  isFeatured: bar.isFeatured,
  averageRating,
  ...(bar.latitude !== null ? { latitude: bar.latitude } : {}),
  ...(bar.longitude !== null ? { longitude: bar.longitude } : {}),
});

const getAverageRatingsByBarId = async (
  barIds: string[],
): Promise<Map<string, number | null>> => {
  const uniqueIds = Array.from(
    new Set(barIds.map((id) => id.trim()).filter(Boolean)),
  );
  const result = new Map<string, number | null>();
  if (uniqueIds.length === 0) return result;

  const aggregates = await db.review.groupBy({
    by: ["barId"],
    where: {
      barId: {
        in: uniqueIds,
      },
      isApproved: true,
      deletedAt: null,
    },
    _avg: {
      rating: true,
    },
    _count: {
      _all: true,
    },
  });

  for (const row of aggregates) {
    result.set(
      row.barId,
      row._count._all === 0 ? null : (row._avg.rating ?? null),
    );
  }

  return result;
};

const toBarImageSummaryDto = (image: {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
}): BarImageSummaryDto => ({
  id: image.id,
  url: image.url,
  altText: image.altText,
  isPrimary: image.isPrimary,
  displayOrder: image.displayOrder,
});

const toBarReviewSummaryDto = (review: {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: Date;
  user: { id: string; name: string | null };
}): BarReviewSummaryDto => ({
  id: review.id,
  rating: review.rating,
  title: review.title,
  content: review.content,
  createdAt: review.createdAt,
  user: {
    id: review.user.id,
    name: review.user.name,
  },
});

const computeAverageRatingFromAggregate = (aggregate: {
  _avg: { rating: number | null };
  _count: { _all: number };
}): number | null => {
  if (aggregate._count._all === 0) return null;
  return aggregate._avg.rating ?? null;
};

const parseTimeToMinutes = (value: string): number | null => {
  const trimmed = value.trim();
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
};

const getMinutesInPhnomPenh = (dateTime: Date): number | null => {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(dateTime);
  const hourPart = parts.find((p) => p.type === "hour")?.value;
  const minutePart = parts.find((p) => p.type === "minute")?.value;

  if (!hourPart || !minutePart) return null;

  const hours = Number(hourPart);
  const minutes = Number(minutePart);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  return hours * 60 + minutes;
};

const isOpenAt = (openingHours: string, dateTime: Date): boolean => {
  const parts = openingHours.split("-");
  if (parts.length !== 2) return false;

  const startMinutes = parseTimeToMinutes(parts[0]);
  const endMinutes = parseTimeToMinutes(parts[1]);
  if (startMinutes === null || endMinutes === null) return false;

  const nowMinutes = getMinutesInPhnomPenh(dateTime);
  if (nowMinutes === null) return false;

  if (startMinutes === endMinutes) return true;

  const crossesMidnight = endMinutes < startMinutes;
  if (!crossesMidnight) {
    return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  }

  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
};

/**
 * Bar repository implementation backed by Prisma.
 */
export const barRepository: IBarRepository = {
  /**
   * Returns all publicly visible bars, optionally filtered by area/category.
   * @param filters Optional filter criteria.
   */
  async findAll(filters?: BarListFilters): Promise<BarDto[]> {
    const bars = await db.bar.findMany({
      where: {
        isApproved: true,
        deletedAt: null,
        ...(filters?.area ? { area: filters.area } : {}),
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.search
          ? {
              OR: [
                {
                  name: {
                    contains: filters.search,
                  },
                },
                {
                  description: {
                    contains: filters.search,
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    const averageRatings = await getAverageRatingsByBarId(
      bars.map((bar) => bar.id),
    );
    return bars.map((bar) => toBarDto(bar, averageRatings.get(bar.id) ?? null));
  },

  async findBySlug(slug: string): Promise<BarDetailDto | null> {
    const bar = await db.bar.findFirst({
      where: {
        slug,
        isApproved: true,
        deletedAt: null,
      },
      include: {
        images: {
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
        },
        reviews: {
          where: {
            isApproved: true,
            deletedAt: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    if (!bar) return null;

    const ratingAggregate = await db.review.aggregate({
      where: {
        barId: bar.id,
        isApproved: true,
        deletedAt: null,
      },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    const images = bar.images.map(toBarImageSummaryDto);
    const reviews = bar.reviews.map(toBarReviewSummaryDto);
    const averageRating = computeAverageRatingFromAggregate(ratingAggregate);

    const primaryImageUrl = images.length > 0 ? images[0].url : null;

    return {
      id: bar.id,
      slug: bar.slug,
      name: bar.name,
      description: bar.description,
      area: bar.area as unknown as BarArea,
      category: bar.category as unknown as BarCategory,
      openingHours: bar.openingHours,
      primaryImageUrl,
      averageRating,
      images,
      reviews,
    };
  },

  /**
   * Upserts a user's rating for a bar and returns the updated average rating.
   * @param barId Bar id.
   * @param userId User id.
   * @param rating Rating in range 1-5.
   */
  async upsertRating(barId: string, userId: string, rating: number) {
    await db.review.upsert({
      where: {
        barId_userId: {
          barId,
          userId,
        },
      },
      update: {
        rating,
        isApproved: true,
        updatedBy: userId,
      },
      create: {
        barId,
        userId,
        rating,
        title: null,
        content: "",
        isApproved: true,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    const ratingAggregate = await db.review.aggregate({
      where: {
        barId,
        isApproved: true,
        deletedAt: null,
      },
      _avg: {
        rating: true,
      },
      _count: {
        _all: true,
      },
    });

    const averageRating = computeAverageRatingFromAggregate(ratingAggregate);
    return {
      averageRating: averageRating ?? rating,
    };
  },

  /**
   * Upserts a user's review for a bar.
   * @param barId Bar id.
   * @param userId User id.
   * @param rating Rating in range 1-5.
   * @param comment Review comment content.
   */
  async upsertReview(
    barId: string,
    userId: string,
    rating: number,
    comment: string,
  ) {
    const review = await db.review.upsert({
      where: {
        barId_userId: {
          barId,
          userId,
        },
      },
      update: {
        rating,
        content: comment,
        isApproved: true,
        deletedAt: null,
        updatedBy: userId,
      },
      create: {
        barId,
        userId,
        rating,
        title: null,
        content: comment,
        isApproved: true,
        createdBy: userId,
        updatedBy: userId,
      },
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: review.id,
      rating: review.rating,
      comment: review.content,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  },

  /**
   * Lists approved, non-deleted featured bars.
   */
  async findFeaturedBars(): Promise<BarDto[]> {
    const bars = await db.bar.findMany({
      where: {
        isApproved: true,
        deletedAt: null,
        isFeatured: true,
      },
      orderBy: [{ name: "asc" }],
    });

    const averageRatings = await getAverageRatingsByBarId(
      bars.map((bar) => bar.id),
    );
    return bars.map((bar) => toBarDto(bar, averageRatings.get(bar.id) ?? null));
  },

  /**
   * Lists approved, non-deleted bars by ids.
   * @param ids Bar ids.
   */
  async findByIds(ids: string[]): Promise<BarDto[]> {
    const uniqueIds = Array.from(
      new Set(ids.map((id) => id.trim()).filter(Boolean)),
    );
    if (uniqueIds.length === 0) return [];

    const bars = await db.bar.findMany({
      where: {
        id: {
          in: uniqueIds,
        },
        isApproved: true,
        deletedAt: null,
      },
      orderBy: [{ name: "asc" }],
    });

    const averageRatings = await getAverageRatingsByBarId(
      bars.map((bar) => bar.id),
    );
    return bars.map((bar) => toBarDto(bar, averageRatings.get(bar.id) ?? null));
  },

  /**
   * Lists approved, non-deleted bars that are open at the given time.
   * @param dateTime Date/time to evaluate against `openingHours`.
   */
  async findOpenBarsAt(dateTime: Date): Promise<BarDto[]> {
    const bars = await db.bar.findMany({
      where: {
        isApproved: true,
        deletedAt: null,
        openingHours: {
          not: null,
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        area: true,
        category: true,
        isFeatured: true,
        latitude: true,
        longitude: true,
        openingHours: true,
      },
      orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    });

    const openBars = bars.filter((bar) => {
      if (!bar.openingHours) return false;
      return isOpenAt(bar.openingHours, dateTime);
    });

    const averageRatings = await getAverageRatingsByBarId(
      openBars.map((bar) => bar.id),
    );
    return openBars.map((bar) =>
      toBarDto(bar as unknown as Bar, averageRatings.get(bar.id) ?? null),
    );
  },

  /**
   * Toggles whether a bar is favorited for the user.
   * @param barId Bar id.
   * @param userId User id.
   */
  async toggleFavorite(barId: string, userId: string) {
    const existing = await db.favoriteBar.findUnique({
      where: {
        userId_barId: {
          userId,
          barId,
        },
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      await db.favoriteBar.delete({
        where: {
          userId_barId: {
            userId,
            barId,
          },
        },
      });

      return { isFavorited: false };
    }

    await db.favoriteBar.create({
      data: {
        userId,
        barId,
      },
      select: {
        id: true,
      },
    });

    return { isFavorited: true };
  },

  /**
   * Lists the user's favorite bars.
   * @param userId User id.
   */
  async findUserFavorites(userId: string): Promise<BarDto[]> {
    const favorites = await db.favoriteBar.findMany({
      where: {
        userId,
        bar: {
          isApproved: true,
          deletedAt: null,
        },
      },
      include: {
        bar: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const bars = favorites.map((favorite) => favorite.bar);
    const averageRatings = await getAverageRatingsByBarId(
      bars.map((bar) => bar.id),
    );
    return bars.map((bar) => toBarDto(bar, averageRatings.get(bar.id) ?? null));
  },
};

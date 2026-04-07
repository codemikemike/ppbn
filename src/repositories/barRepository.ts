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

const toBarDto = (bar: Bar): BarDto => ({
  id: bar.id,
  slug: bar.slug,
  name: bar.name,
  area: bar.area as unknown as BarArea,
  category: bar.category as unknown as BarCategory,
  isFeatured: bar.isFeatured,
  ...(bar.latitude !== null ? { latitude: bar.latitude } : {}),
  ...(bar.longitude !== null ? { longitude: bar.longitude } : {}),
});

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

const computeAverageRating = (
  reviews: Array<{ rating: number }>,
): number | null => {
  if (reviews.length === 0) return null;

  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
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

    return bars.map(toBarDto);
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

    const images = bar.images.map(toBarImageSummaryDto);
    const reviews = bar.reviews.map(toBarReviewSummaryDto);
    const averageRating = computeAverageRating(bar.reviews);

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

    return bars.map(toBarDto);
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

    return bars.map(toBarDto);
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

    return openBars.map((bar) => toBarDto(bar as unknown as Bar));
  },
};

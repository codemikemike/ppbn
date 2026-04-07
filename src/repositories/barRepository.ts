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
};

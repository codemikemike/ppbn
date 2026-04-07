import type { BarArea } from "./BarArea";
import type { BarCategory } from "./BarCategory";

export type BarImageSummaryDto = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  displayOrder: number;
};

export type BarReviewSummaryDto = {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
  };
};

export type BarDetailDto = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  area: BarArea;
  category: BarCategory;
  openingHours: string | null;
  primaryImageUrl: string | null;
  averageRating: number | null;
  images: BarImageSummaryDto[];
  reviews: BarReviewSummaryDto[];
};

import type { BarArea } from "./BarArea";
import type { BarCategory } from "./BarCategory";

/**
 * Admin list row for a bar.
 */
export type AdminBarListItemDto = {
  id: string;
  slug: string;
  name: string;
  area: BarArea;
  category: BarCategory;
  isApproved: boolean;
  deletedAt: Date | null;
  createdAt: Date;
};

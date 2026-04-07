import type { BarArea } from "./BarArea";
import type { BarCategory } from "./BarCategory";

export type BarDto = {
  id: string;
  slug: string;
  name: string;
  area: BarArea;
  category: BarCategory;
  isFeatured: boolean;
};

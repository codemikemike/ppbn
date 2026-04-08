import type { BarArea } from "./BarArea";
import type { BarCategory } from "./BarCategory";

export type CreateBarData = {
  name: string;
  area: BarArea;
  category: BarCategory;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
};

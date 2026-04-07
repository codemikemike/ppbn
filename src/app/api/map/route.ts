import { NextResponse } from "next/server";

import { barService } from "@/services/barService";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";

/**
 * ISR revalidation window for map data.
 * @returns Revalidation window in seconds.
 */
export const revalidate = 3600;

const AREA_VALUES: readonly BarArea[] = [
  "Riverside",
  "BKK1",
  "Street136",
  "Street104",
];

const CATEGORY_VALUES: readonly BarCategory[] = [
  "HostessBar",
  "Pub",
  "Club",
  "RooftopBar",
  "CocktailBar",
  "SportsBar",
  "KaraokeBar",
  "DiveBar",
  "WineBar",
  "Lounge",
  "GayBar",
  "LiveMusic",
];

const isBarArea = (value: string): value is BarArea =>
  (AREA_VALUES as readonly string[]).includes(value);

const isBarCategory = (value: string): value is BarCategory =>
  (CATEGORY_VALUES as readonly string[]).includes(value);

/**
 * GET /api/map
 * Returns approved bars with coordinates for map rendering.
 *
 * @param request - Next.js request object.
 * @returns A JSON response containing bars with coordinates.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const areaParam = url.searchParams.get("area");
    const categoryParam = url.searchParams.get("category");

    const area = areaParam && isBarArea(areaParam) ? areaParam : undefined;
    const category =
      categoryParam && isBarCategory(categoryParam) ? categoryParam : undefined;

    const bars = await barService.listApprovedBars({ area, category });

    const barsWithCoordinates = bars.filter(
      (bar) =>
        typeof bar.latitude === "number" && typeof bar.longitude === "number",
    );

    return NextResponse.json(barsWithCoordinates);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load map data. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

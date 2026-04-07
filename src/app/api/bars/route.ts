import { NextResponse } from "next/server";
import { barService } from "@/services/barService";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";

export const revalidate = 3600;

const BAR_AREAS: readonly BarArea[] = [
  "Riverside",
  "BKK1",
  "Street136",
  "Street104",
] as const;

const BAR_CATEGORIES: readonly BarCategory[] = [
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
] as const;

const isBarArea = (value: string): value is BarArea =>
  (BAR_AREAS as readonly string[]).includes(value);

const isBarCategory = (value: string): value is BarCategory =>
  (BAR_CATEGORIES as readonly string[]).includes(value);

/**
 * Lists approved, non-deleted bars with optional filters.
 * @param request Incoming request with optional query params.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const areaParam = url.searchParams.get("area");
    const categoryParam = url.searchParams.get("category");

    if (areaParam && areaParam !== "All" && !isBarArea(areaParam)) {
      return NextResponse.json(
        { error: "Invalid area filter.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    if (
      categoryParam &&
      categoryParam !== "All" &&
      !isBarCategory(categoryParam)
    ) {
      return NextResponse.json(
        { error: "Invalid category filter.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const area =
      areaParam && areaParam !== "All" && isBarArea(areaParam)
        ? areaParam
        : undefined;
    const category =
      categoryParam && categoryParam !== "All" && isBarCategory(categoryParam)
        ? categoryParam
        : undefined;

    const bars = await barService.listApprovedBars({
      ...(area ? { area } : {}),
      ...(category ? { category } : {}),
    });

    return NextResponse.json(bars);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load bars. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

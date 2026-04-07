import Link from "next/link";

import { barService } from "@/services/barService";
import { Button } from "@/components/ui/button";
import MapClient from "@/components/map/MapClient";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";
import { BAR_CATEGORY_LABELS } from "@/domain/constants";

/**
 * ISR revalidation window for the Map page.
 * @returns Revalidation window in seconds.
 */
export const revalidate = 3600;

type MapPageProps = {
  searchParams?: Promise<{ area?: string; category?: string }>;
};

const AREA_OPTIONS: ReadonlyArray<{ value: BarArea | null; label: string }> = [
  { value: null, label: "All" },
  { value: "Riverside", label: "Riverside" },
  { value: "BKK1", label: "BKK1" },
  { value: "Street136", label: "Street136" },
  { value: "Street104", label: "Street104" },
];

const CATEGORY_OPTIONS: ReadonlyArray<{
  value: BarCategory | null;
  label: string;
}> = [
  { value: null, label: "All" },
  { value: "HostessBar", label: BAR_CATEGORY_LABELS.HostessBar },
  { value: "Pub", label: BAR_CATEGORY_LABELS.Pub },
  { value: "Club", label: BAR_CATEGORY_LABELS.Club },
  { value: "RooftopBar", label: BAR_CATEGORY_LABELS.RooftopBar },
  { value: "CocktailBar", label: BAR_CATEGORY_LABELS.CocktailBar },
  { value: "SportsBar", label: BAR_CATEGORY_LABELS.SportsBar },
  { value: "KaraokeBar", label: BAR_CATEGORY_LABELS.KaraokeBar },
  { value: "DiveBar", label: BAR_CATEGORY_LABELS.DiveBar },
  { value: "WineBar", label: BAR_CATEGORY_LABELS.WineBar },
  { value: "Lounge", label: BAR_CATEGORY_LABELS.Lounge },
  { value: "GayBar", label: BAR_CATEGORY_LABELS.GayBar },
  { value: "LiveMusic", label: BAR_CATEGORY_LABELS.LiveMusic },
];

const AREA_VALUES = AREA_OPTIONS.map((option) => option.value).filter(
  (value): value is BarArea => Boolean(value),
);

const CATEGORY_VALUES = CATEGORY_OPTIONS.map((option) => option.value).filter(
  (value): value is BarCategory => Boolean(value),
);

const isBarArea = (value: string): value is BarArea =>
  (AREA_VALUES as readonly string[]).includes(value);

const isBarCategory = (value: string): value is BarCategory =>
  (CATEGORY_VALUES as readonly string[]).includes(value);

const buildMapHref = (filters: {
  area: BarArea | null;
  category: BarCategory | null;
}) => {
  const params = new URLSearchParams();
  if (filters.area) params.set("area", filters.area);
  if (filters.category) params.set("category", filters.category);

  const query = params.toString();
  return query ? `/map?${query}` : "/map";
};

/**
 * Renders the interactive map page with server-side filtering.
 *
 * Reads `area` and `category` from the query string, fetches approved bars from
 * the service layer, and renders an interactive Leaflet map (client-only).
 *
 * @param props - Next.js page props.
 * @param props.searchParams - Query string parameters provided by Next.js.
 * @returns The Map page UI.
 */
export default async function MapPage({ searchParams }: MapPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const activeArea =
    resolvedSearchParams.area && isBarArea(resolvedSearchParams.area)
      ? resolvedSearchParams.area
      : null;
  const activeCategory =
    resolvedSearchParams.category &&
    isBarCategory(resolvedSearchParams.category)
      ? resolvedSearchParams.category
      : null;

  const bars = await barService.listApprovedBars({
    ...(activeArea ? { area: activeArea } : {}),
    ...(activeCategory ? { category: activeCategory } : {}),
  });

  const barsWithCoordinates = bars.filter(
    (bar) =>
      typeof bar.latitude === "number" && typeof bar.longitude === "number",
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header>
        <h1 className="text-2xl font-semibold">Map</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore Phnom Penh nightlife bars by location.
        </p>
      </header>

      <nav aria-label="Map filters" className="mt-6 space-y-4">
        <div>
          <h2 className="text-sm font-medium">Area</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {AREA_OPTIONS.map((option) => {
              const isActive = option.value === activeArea;
              return (
                <Button
                  key={option.label}
                  variant={isActive ? "secondary" : "outline"}
                  asChild
                >
                  <Link
                    href={buildMapHref({
                      area: option.value,
                      category: activeCategory,
                    })}
                  >
                    {option.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium">Category</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => {
              const isActive = option.value === activeCategory;
              return (
                <Button
                  key={option.label}
                  variant={isActive ? "secondary" : "outline"}
                  asChild
                >
                  <Link
                    href={buildMapHref({
                      area: activeArea,
                      category: option.value,
                    })}
                  >
                    {option.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>

      {barsWithCoordinates.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No bars with coordinates found for the selected filters.
        </p>
      ) : (
        <MapClient bars={barsWithCoordinates} />
      )}
    </main>
  );
}

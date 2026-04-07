import Link from "next/link";

import { barService } from "@/services/barService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BAR_CATEGORY_LABELS } from "@/domain/constants";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";

export const revalidate = 3600;

type BarsPageProps = {
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

const buildBarsHref = (filters: {
  area: BarArea | null;
  category: BarCategory | null;
}) => {
  const params = new URLSearchParams();
  if (filters.area) params.set("area", filters.area);
  if (filters.category) params.set("category", filters.category);

  const query = params.toString();
  return query ? `/bars?${query}` : "/bars";
};

/**
 * Bars listing page with URL-driven area/category filters.
 */
export default async function BarsPage({ searchParams }: BarsPageProps) {
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

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Bars</h1>

      <nav aria-label="Bar filters" className="mt-6 space-y-4">
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
                    href={buildBarsHref({
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
                    href={buildBarsHref({
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

      {bars.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No bars available yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4">
          {bars.map((bar) => (
            <Link key={bar.id} href={`/bars/${bar.slug}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>{bar.name}</span>
                    {bar.isFeatured ? (
                      <span className="text-xs text-muted-foreground">
                        Featured
                      </span>
                    ) : null}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Area</dt>
                      <dd>{bar.area}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Category</dt>
                      <dd>{bar.category}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

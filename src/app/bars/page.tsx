import Link from "next/link";
import { Star, X } from "lucide-react";

import { barService } from "@/services/barService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BAR_CATEGORY_LABELS } from "@/domain/constants";
import type { BarArea } from "@/domain/dtos/BarArea";
import type { BarCategory } from "@/domain/dtos/BarCategory";

export const revalidate = 3600;

type BarsPageProps = {
  searchParams?: Promise<{ area?: string; category?: string; search?: string }>;
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
  search: string | null;
}) => {
  const params = new URLSearchParams();
  if (filters.area) params.set("area", filters.area);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  return query ? `/bars?${query}` : "/bars";
};

const StaticStars = ({ rating }: { rating: number | null }) => {
  if (rating === null) {
    return <span className="text-xs text-muted-foreground">No ratings</span>;
  }

  const clamped = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < clamped;
        return (
          <Star
            key={index}
            className={
              filled
                ? "h-4 w-4 fill-[#d4af37] text-[#d4af37]"
                : "h-4 w-4 text-muted-foreground"
            }
          />
        );
      })}
      <span className="ml-1 text-xs text-muted-foreground">
        {rating.toFixed(1)}
      </span>
    </div>
  );
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

  const activeSearch = resolvedSearchParams.search?.trim()
    ? resolvedSearchParams.search.trim()
    : null;

  const bars = await barService.listApprovedBars({
    ...(activeArea ? { area: activeArea } : {}),
    ...(activeCategory ? { category: activeCategory } : {}),
    ...(activeSearch ? { search: activeSearch } : {}),
  });

  return (
    <main className="ppbn-page mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <header className="ppbn-hero-frame space-y-4 rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">
          Bar Directory
        </p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Bars
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Find your next spot in Phnom Penh with a premium dark layout, red
          active filters, and featured venues that glow on hover.
        </p>
      </header>

      <search className="mt-6 block" aria-label="Search bars">
        <form
          role="search"
          method="get"
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label htmlFor="bar-search" className="sr-only">
            Search bars
          </label>
          <Input
            id="bar-search"
            name="search"
            placeholder="Search bars..."
            defaultValue={activeSearch ?? ""}
            className="ppbn-input"
          />
          {activeArea ? (
            <input type="hidden" name="area" value={activeArea} />
          ) : null}
          {activeCategory ? (
            <input type="hidden" name="category" value={activeCategory} />
          ) : null}
          {activeSearch ? (
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={buildBarsHref({
                  area: activeArea,
                  category: activeCategory,
                  search: null,
                })}
                aria-label="Clear search"
              >
                <X />
              </Link>
            </Button>
          ) : null}
        </form>
      </search>

      <nav aria-label="Bar filters" className="mt-6 space-y-5">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-white">
            Area
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {AREA_OPTIONS.map((option) => {
              const isActive = option.value === activeArea;
              return (
                <Link
                  key={option.label}
                  href={buildBarsHref({
                    area: option.value,
                    category: activeCategory,
                    search: activeSearch,
                  })}
                  className={
                    isActive ? "ppbn-chip ppbn-chip-active" : "ppbn-chip"
                  }
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.24em] text-white">
            Category
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((option) => {
              const isActive = option.value === activeCategory;
              return (
                <Link
                  key={option.label}
                  href={buildBarsHref({
                    area: activeArea,
                    category: option.value,
                    search: activeSearch,
                  })}
                  className={
                    isActive ? "ppbn-chip ppbn-chip-active" : "ppbn-chip"
                  }
                >
                  {option.label}
                </Link>
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
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bars.map((bar) => (
            <Link key={bar.id} href={`/bars/${bar.slug}`} className="block">
              <Card className="ppbn-card glass-card hover:glow-red transition-all overflow-hidden rounded-[1.5rem]">
                <div className="relative h-40 gradient-red" aria-hidden="true">
                  {bar.isFeatured ? (
                    <div className="absolute left-3 top-3">
                      <span className="ppbn-badge-featured">FEATURED</span>
                    </div>
                  ) : null}
                </div>

                <CardHeader>
                  <CardTitle className="font-display flex items-start justify-between gap-3 text-white">
                    <span className="min-w-0 truncate">{bar.name}</span>
                    <span className="ppbn-pill">{bar.category}</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {bar.area}
                  </p>
                  <StaticStars rating={bar.averageRating} />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

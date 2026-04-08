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
export default async function MapPage({}: MapPageProps) {
  return (
    <main className="ppbn-page mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <header className="ppbn-hero-frame space-y-4 rounded-[2rem] p-6 sm:p-8 text-center">
        <h1 className="font-display text-gradient-red text-5xl font-black uppercase tracking-[-0.08em] sm:text-6xl mb-2">
          Phnom Penh Bar Map
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Explore every nightlife bar and venue on the city map.
        </p>
      </header>
      <section className="mt-10 flex flex-col items-center">
        <div className="glass-card rounded-2xl overflow-hidden border border-border/70 w-full" style={{ maxWidth: 1200 }}>
          <iframe
            src={`https://www.google.com/maps/d/u/0/embed?mid=1w7V0tge2Rmy76hPrtH3k-wsWfGUF9Hk&ehbc=2E312F`}
            width="100%"
            height="650"
            style={{ border: 0, borderRadius: '8px', width: '100%' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Phnom Penh Bar Map"
          />
        </div>
        <a
          href="https://www.google.com/maps/d/u/0/viewer?mid=1w7V0tge2Rmy76hPrtH3k-wsWfGUF9Hk&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full border-2 border-(--accent-red) px-6 py-2 font-display text-lg text-white transition-all hover:bg-(--accent-red) hover:text-white"
        >
          Open in Google Maps
        </a>
      </section>
    </main>
  );
}

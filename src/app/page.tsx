import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  MapPinned,
  Music4,
  Sparkles,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { blogService } from "@/services/blogService";
import { tonightService } from "@/services/tonightService";

export const revalidate = 3600;

const AREAS: ReadonlyArray<{ label: string; area: string }> = [
  { label: "Riverside", area: "Riverside" },
  { label: "BKK1", area: "BKK1" },
  { label: "Street 136", area: "Street136" },
  { label: "Street 104", area: "Street104" },
];

const formatShortDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));

const formatRating = (rating: number | null) =>
  rating === null ? "No ratings yet" : rating.toFixed(1);

const StaticStars = ({ rating }: { rating: number | null }) => {
  if (rating === null) {
    return (
      <span className="text-xs text-muted-foreground">No ratings yet</span>
    );
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
                ? "h-4 w-4 fill-(--accent-gold) text-(--accent-gold)"
                : "h-4 w-4 text-muted-foreground/60"
            }
          />
        );
      })}
      <span className="ml-1 text-xs font-medium text-(--accent-gold)">
        {formatRating(rating)}
      </span>
    </div>
  );
};

/**
 * PPBN homepage.
 *
 * @returns The premium dark nightlife landing page.
 */
export default async function Home() {
  const [tonight, latestPosts] = await Promise.all([
    tonightService.getTonightData(),
    blogService.listPublishedPosts(1, 3),
  ]);

  const featuredBars = tonight.featuredBars.slice(0, 4);
  const openBarIds = new Set(tonight.openBars.map((bar) => bar.id));
  const liveMusicCount = tonight.liveMusicVenues.length;

  return (
    <div className="ppbn-page flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="ppbn-hero-bg relative overflow-hidden border-b border-border/70">
          <div className="ppbn-grid-overlay pointer-events-none absolute inset-0 opacity-60" />

          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-24">
            <div className="relative z-10 flex flex-col justify-center space-y-8">
              <div className="space-y-5">
                <p className="ppbn-hero-kicker">
                  <Flame className="h-4 w-4" />
                  Phnom Penh after dark
                </p>
                <h1 className="ppbn-hero-title font-display text-balance text-gradient-red">
                  Premium nightlife. Black canvas. Red heat.
                </h1>
                <p className="ppbn-hero-copy text-pretty">
                  Discover the city&apos;s sharpest bars, the busiest rooms, and
                  the venues that matter tonight. Built for late evenings, loud
                  rooms, and a little gold in the details.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="ppbn-button" asChild>
                  <Link href="/bars" className="inline-flex items-center gap-2">
                    Explore Bars
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button className="ppbn-button" variant="outline" asChild>
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2"
                  >
                    Tonight&apos;s Events
                    <CalendarDays className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                <span className="ppbn-pill text-(--accent-gold)">
                  <Sparkles className="h-3.5 w-3.5" />
                  Revalidated hourly
                </span>
                <span className="ppbn-pill">Black / Red / Gold palette</span>
                <span className="ppbn-pill">Glassmorphism / glow / motion</span>
              </div>
            </div>

            <div className="relative z-10">
              <Card className="ppbn-hero-frame glass-card hover:glow-red transition-all rounded-[2rem] p-0">
                <CardContent className="relative space-y-6 p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--accent-gold)">
                        Tonight in Phnom Penh
                      </p>
                      <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.06em] text-white">
                        Live right now
                      </h2>
                    </div>
                    <span className="ppbn-badge-featured">Featured</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        label: "Open bars",
                        value: tonight.openBars.length,
                        icon: MapPinned,
                      },
                      {
                        label: "Live music venues",
                        value: liveMusicCount,
                        icon: Music4,
                      },
                      {
                        label: "Events tonight",
                        value: tonight.eventsTonight.length,
                        icon: Flame,
                      },
                      {
                        label: "Featured bars",
                        value: featuredBars.length,
                        icon: Sparkles,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="ppbn-card glass-card hover:glow-red transition-all ppbn-card-strong rounded-2xl p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              {item.label}
                            </p>
                            <p className="mt-2 text-3xl font-black tracking-[-0.08em] text-white">
                              {item.value}
                            </p>
                          </div>
                          <item.icon className="h-5 w-5 text-(--accent-gold)" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        Featured bars
                      </p>
                      <Link
                        href="/bars"
                        className="text-xs uppercase tracking-[0.24em] text-(--accent-gold) hover:text-white"
                      >
                        View all
                      </Link>
                    </div>

                    <div className="space-y-3">
                      {featuredBars.length === 0 ? (
                        <div className="space-y-3">
                          <div className="ppbn-skeleton h-20" />
                          <div className="ppbn-skeleton h-20" />
                        </div>
                      ) : (
                        featuredBars.map((bar) => {
                          const isOpen = openBarIds.has(bar.id);

                          return (
                            <Link
                              key={bar.id}
                              href={`/bars/${bar.slug}`}
                              className="group block"
                            >
                              <article className="ppbn-card rounded-2xl p-4 transition-transform duration-200 group-hover:-translate-y-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="ppbn-badge-featured">
                                        Featured
                                      </span>
                                      <span className="ppbn-pill">
                                        {bar.area}
                                      </span>
                                      <span className="ppbn-pill">
                                        {bar.category}
                                      </span>
                                    </div>
                                    <h3 className="truncate text-lg font-bold tracking-[-0.04em] text-white">
                                      {bar.name}
                                    </h3>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 text-right">
                                    <StaticStars rating={bar.averageRating} />
                                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                                      {isOpen ? "Open now" : "Tonight"}
                                    </span>
                                  </div>
                                </div>
                              </article>
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {formatShortDate(tonight.date)} · refreshed with the latest
                    nightlife data
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <RevealOnScroll>
            <section aria-labelledby="stats-title" className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">
                    Atmosphere
                  </p>
                  <h2
                    id="stats-title"
                    className="ppbn-section-title font-display mt-2 text-white"
                  >
                    Built to feel expensive
                  </h2>
                </div>
                <p className="ppbn-section-copy max-w-2xl text-sm sm:text-right">
                  Every panel, border, and highlight leans into a premium dark
                  editorial style: black foundations, red energy, gold accents,
                  and motion that stays sharp instead of noisy.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    label: "featured venues",
                    value: featuredBars.length,
                    detail: "Curated for late nights",
                  },
                  {
                    label: "bars open now",
                    value: tonight.openBars.length,
                    detail: "Live tonight in the city",
                  },
                  {
                    label: "events tonight",
                    value: tonight.eventsTonight.length,
                    detail: "What is actually happening",
                  },
                  {
                    label: "areas covered",
                    value: AREAS.length,
                    detail: "Neighborhood discovery",
                  },
                ].map((item) => (
                  <Card
                    key={item.label}
                    className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.75rem]"
                  >
                    <CardContent className="space-y-4 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="text-4xl font-black tracking-[-0.08em] text-white">
                        {item.value}
                      </p>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.detail}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section
              aria-labelledby="featured-bars-title"
              className="space-y-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-red-bright)">
                    Featured tonight
                  </p>
                  <h2
                    id="featured-bars-title"
                    className="ppbn-section-title font-display mt-2 text-white"
                  >
                    Bars worth your time
                  </h2>
                </div>
                <Link
                  href="/bars"
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-(--accent-gold) transition hover:text-white"
                >
                  Browse all bars
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {featuredBars.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div
                      key={index}
                      className="ppbn-skeleton h-56 rounded-[1.75rem]"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {featuredBars.map((bar) => {
                    const isOpen = openBarIds.has(bar.id);

                    return (
                      <Link
                        key={bar.id}
                        href={`/bars/${bar.slug}`}
                        className="group block"
                      >
                        <article className="ppbn-card glass-card hover:glow-red transition-all h-full overflow-hidden rounded-[1.75rem]">
                          <div className="h-36 bg-[radial-gradient(circle_at_20%_20%,rgba(204,0,0,0.45),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(212,175,55,0.25),transparent_26%),linear-gradient(180deg,#1f1f1f,#111)]" />
                          <div className="space-y-4 p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-2">
                                <span className="ppbn-badge-featured">
                                  Featured
                                </span>
                                <h3 className="font-display text-xl font-bold tracking-[-0.05em] text-white">
                                  {bar.name}
                                </h3>
                              </div>
                              <span className="ppbn-pill">
                                {isOpen ? "Open" : "Tonight"}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <span className="ppbn-pill">{bar.area}</span>
                              <span className="ppbn-pill">{bar.category}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <StaticStars rating={bar.averageRating} />
                              <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition group-hover:text-(--accent-gold)">
                                View details
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section aria-labelledby="areas-title" className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">
                    Explore by area
                  </p>
                  <h2
                    id="areas-title"
                    className="ppbn-section-title font-display mt-2 text-white"
                  >
                    Move through the city
                  </h2>
                </div>
                <p className="ppbn-section-copy max-w-xl text-sm sm:text-right">
                  Use the neighborhoods locals actually talk about. Each area
                  link is a shortcut into a different kind of night.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {AREAS.map((area) => (
                  <Link
                    key={area.area}
                    href={`/bars?area=${area.area}`}
                    className="group block"
                  >
                    <article className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.5rem] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
                            District
                          </p>
                          <h3 className="font-display mt-2 text-2xl font-black tracking-[-0.06em] text-white">
                            {area.label}
                          </h3>
                        </div>
                        <MapPinned className="h-6 w-6 text-(--accent-red-bright) transition group-hover:text-(--accent-gold)" />
                      </div>
                      <p className="mt-5 text-sm text-muted-foreground">
                        Browse bars, venues, and nightlife options around{" "}
                        {area.label}.
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section aria-labelledby="blog-title" className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-red-bright)">
                    Editorial
                  </p>
                  <h2
                    id="blog-title"
                    className="ppbn-section-title font-display mt-2 text-white"
                  >
                    The latest from the blog
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-(--accent-gold) transition hover:text-white"
                >
                  Read all stories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {latestPosts.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div
                      key={index}
                      className="ppbn-skeleton h-52 rounded-[1.75rem]"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {latestPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block h-full"
                    >
                      <article className="ppbn-card glass-card hover:glow-red transition-all flex h-full flex-col overflow-hidden rounded-[1.75rem]">
                        <div className="h-32 bg-[radial-gradient(circle_at_20%_20%,rgba(204,0,0,0.45),transparent_35%),radial-gradient(circle_at_82%_28%,rgba(212,175,55,0.24),transparent_28%),linear-gradient(180deg,#1e1e1e,#101010)]" />
                        <div className="flex flex-1 flex-col gap-4 p-5">
                          <div className="flex items-center justify-between gap-3">
                            <span className="ppbn-pill">
                              {post.category ?? "Nightlife"}
                            </span>
                            <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                              {new Intl.DateTimeFormat("en-GB", {
                                day: "2-digit",
                                month: "short",
                              }).format(new Date(post.publishedAt))}
                            </span>
                          </div>
                          <h3 className="font-display text-xl font-bold tracking-[-0.05em] text-white">
                            {post.title}
                          </h3>
                          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                            {post.excerpt ??
                              "Read the latest stories from Phnom Penh By Night."}
                          </p>
                          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                            <span className="text-xs uppercase tracking-[0.22em] text-(--accent-gold)">
                              Open article
                            </span>
                            <ArrowRight className="h-4 w-4 text-(--accent-red-bright) transition group-hover:translate-x-1 group-hover:text-(--accent-gold)" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section
              aria-labelledby="cta-title"
              className="ppbn-hero-frame rounded-[2rem] p-6 sm:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">
                    Ready to go out
                  </p>
                  <h2
                    id="cta-title"
                    className="font-display text-3xl font-black uppercase tracking-[-0.06em] text-white sm:text-4xl"
                  >
                    Start with the strongest venues.
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Browse the city&apos;s best bars, check what is open
                    tonight, and move from there. The theme is dark, the
                    lighting is low, and the route into a good night is fast.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="ppbn-button" asChild>
                    <Link href="/bars">Browse bars</Link>
                  </Button>
                  <Button className="ppbn-button" variant="outline" asChild>
                    <Link href="/tonight">See tonight</Link>
                  </Button>
                </div>
              </div>
            </section>
          </RevealOnScroll>
        </div>
      </main>

      {/* Footer removed: now rendered globally in layout.tsx */}
    </div>
  );
}

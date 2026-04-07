import Link from "next/link";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
                ? "h-4 w-4 fill-[var(--accent-gold)] text-[var(--accent-gold)]"
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
 * PPBN homepage.
 *
 * @returns The premium dark nightlife landing page.
 */
export default async function Home() {
  const [tonight, latestPosts] = await Promise.all([
    tonightService.getTonightData(),
    blogService.listPublishedPosts(1, 3),
  ]);

  return (
    <div className="ppbn-page flex flex-1 flex-col">
      <main>
        <section className="ppbn-hero-bg relative overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-24">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">
                PHNOM PENH · NIGHTLIFE
              </p>
              <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
                PHNOM PENH BY NIGHT
              </h1>
              <p className="text-pretty text-lg leading-8 text-muted-foreground">
                Discover the Best Nightlife in Cambodia
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="ppbn-button" asChild>
                  <Link href="/bars">Explore Bars</Link>
                </Button>
                <Button className="ppbn-button" variant="outline" asChild>
                  <Link href="/events">Tonight&apos;s Events</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl space-y-14 px-4 py-12">
          <RevealOnScroll>
            <section className="space-y-4" aria-label="Trending bars">
              <header className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Trending Bars This Week
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Featured venues, curated for the city after dark.
                  </p>
                </div>
                <Link
                  href="/bars"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  View all
                </Link>
              </header>

              {tonight.featuredBars.length === 0 ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="ppbn-skeleton h-24" />
                  <div className="ppbn-skeleton h-24" />
                  <div className="ppbn-skeleton h-24" />
                </div>
              ) : (
                <div className="-mx-4 overflow-x-auto px-4">
                  <ul className="flex snap-x snap-mandatory gap-4 pb-2">
                    {tonight.featuredBars.map((bar) => (
                      <li
                        key={bar.id}
                        className="snap-start"
                        aria-label={`${bar.name} featured bar`}
                      >
                        <Link href={`/bars/${bar.slug}`} className="block">
                          <div className="ppbn-card w-[280px] overflow-hidden rounded-xl">
                            <div className="relative h-28 ppbn-hero-bg" />
                            <div className="space-y-2 p-4">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-medium">
                                  {bar.name}
                                </p>
                                <span className="ppbn-badge-featured">
                                  FEATURED
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {bar.area} · {bar.category}
                              </p>
                              <StaticStars rating={bar.averageRating} />
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section className="grid gap-4 md:grid-cols-2" aria-label="Tonight">
              <Card className="ppbn-card">
                <CardHeader>
                  <h2 className="text-base font-medium">
                    Tonight in Phnom Penh
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    A quick preview of what is happening right now.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <dl className="grid grid-cols-2 gap-3">
                    <div className="rounded-md border border-border/70 p-3">
                      <dt className="text-xs text-muted-foreground">Events</dt>
                      <dd className="mt-1 text-lg font-medium">
                        {tonight.eventsTonight.length}
                      </dd>
                    </div>
                    <div className="rounded-md border border-border/70 p-3">
                      <dt className="text-xs text-muted-foreground">
                        Open bars
                      </dt>
                      <dd className="mt-1 text-lg font-medium">
                        {tonight.openBars.length}
                      </dd>
                    </div>
                  </dl>

                  <Button className="ppbn-button" asChild>
                    <Link href="/tonight">Open Tonight</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="ppbn-card">
                <CardHeader>
                  <h2 className="text-base font-medium">Explore by Area</h2>
                  <p className="text-sm text-muted-foreground">
                    Find nightlife in the neighborhoods locals love.
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {AREAS.map((area) => (
                      <li key={area.area}>
                        <Link
                          href={`/bars?area=${area.area}`}
                          className="ppbn-card flex min-h-11 items-center justify-between rounded-xl px-4 py-3"
                        >
                          <span className="text-sm font-medium">
                            {area.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Browse
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </RevealOnScroll>

          <RevealOnScroll>
            <section className="space-y-4" aria-label="Latest blog posts">
              <header className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Latest from the Blog
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Guides, stories, and nightlife intel.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  View all
                </Link>
              </header>

              {latestPosts.length === 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="ppbn-skeleton h-24" />
                  <div className="ppbn-skeleton h-24" />
                  <div className="ppbn-skeleton h-24" />
                </div>
              ) : (
                <ul className="grid gap-4 md:grid-cols-3">
                  {latestPosts.map((post) => (
                    <li key={post.id}>
                      <Link href={`/blog/${post.slug}`} className="block">
                        <Card className="ppbn-card">
                          <CardHeader>
                            <h3 className="text-sm font-medium">
                              {post.title}
                            </h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {post.excerpt ?? "Read the latest from PPBN."}
                            </p>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground">
                              {post.category ?? "Nightlife"}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </RevealOnScroll>
        </div>
      </main>

      <footer className="mt-auto border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Phnom Penh By Night
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-4 text-xs">
            <Link
              href="/bars"
              className="text-muted-foreground hover:underline"
            >
              Bars
            </Link>
            <Link
              href="/events"
              className="text-muted-foreground hover:underline"
            >
              Events
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:underline"
            >
              Blog
            </Link>
            <Link
              href="/staff"
              className="text-muted-foreground hover:underline"
            >
              Staff
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:underline"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tonightService } from "@/services/tonightService";
import type { EventDto } from "@/domain/dtos/EventDto";

/**
 * ISR revalidation window for the Tonight page.
 */
export const revalidate = 3600;

/**
 * SEO metadata for the Tonight page.
 */
export const metadata: Metadata = {
  title: "Tonight in Phnom Penh",
  description:
    "Discover events, live music venues, bars open tonight, and featured bars in Phnom Penh.",
};

const toPhnomPenhDate = (isoDate: string): Date => {
  return new Date(`${isoDate}T00:00:00+07:00`);
};

const formatTodayLabel = (isoDate: string) => {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh",
  }).format(toPhnomPenhDate(isoDate));
};

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Phnom_Penh",
  }).format(date);

const formatEventTime = (event: EventDto) => {
  const start = formatTime(event.startTime);
  if (!event.endTime) return start;
  const end = formatTime(event.endTime);
  return `${start}–${end}`;
};

export default async function TonightPage() {
  const data = await tonightService.getTonightData();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold">Tonight in Phnom Penh</h1>
        <p className="mt-2 text-base text-muted-foreground">
          <span className="font-medium text-foreground">
            {formatTodayLabel(data.date)}
          </span>
        </p>
      </header>

      <section className="mt-8" aria-labelledby="events-tonight">
        <h2 id="events-tonight" className="text-xl font-semibold">
          Events Tonight
        </h2>

        {data.eventsTonight.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No events listed for today.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.eventsTonight.map((event) => (
              <article key={event.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="text-sm text-muted-foreground">
                      <div>
                        <dt className="sr-only">Time</dt>
                        <dd>
                          <time dateTime={event.startTime.toISOString()}>
                            {formatEventTime(event)}
                          </time>
                        </dd>
                      </div>
                      <div className="mt-1">
                        <dt className="sr-only">Bar</dt>
                        <dd>
                          <Link
                            href={`/bars/${event.barSlug}`}
                            className="hover:underline"
                          >
                            {event.barName}
                          </Link>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="bars-open-tonight">
        <h2 id="bars-open-tonight" className="text-xl font-semibold">
          Bars Open Tonight
        </h2>

        {data.openBars.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No bars are marked as open tonight.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.openBars.map((bar) => (
              <Card key={bar.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      href={`/bars/${bar.slug}`}
                      className="hover:underline"
                    >
                      {bar.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {bar.area} • {bar.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="live-music-tonight">
        <h2 id="live-music-tonight" className="text-xl font-semibold">
          Live Music Tonight
        </h2>

        {data.liveMusicVenues.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No live music venues found for today.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.liveMusicVenues.map((bar) => (
              <Card key={bar.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      href={`/bars/${bar.slug}`}
                      className="hover:underline"
                    >
                      {bar.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {bar.area} • {bar.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="featured-bars">
        <h2 id="featured-bars" className="text-xl font-semibold">
          Featured Bars
        </h2>

        {data.featuredBars.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No featured bars.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.featuredBars.map((bar) => (
              <Card key={bar.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      href={`/bars/${bar.slug}`}
                      className="hover:underline"
                    >
                      {bar.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {bar.area} • {bar.category}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

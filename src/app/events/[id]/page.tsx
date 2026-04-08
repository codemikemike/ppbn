import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { eventService } from "@/services/eventService";
import { NotFoundError } from "@/domain/errors/DomainErrors";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ id: string }>;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

/**
 * Event detail page.
 */
export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await eventService.getUpcomingEventById(id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  return (
    <main className="ppbn-page mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <nav aria-label="Breadcrumb">
        <Link
          href="/events"
          className="text-sm text-muted-foreground hover:text-white"
        >
          Back to Events
        </Link>
      </nav>

      <header className="ppbn-hero-frame mt-4 space-y-4 rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">
          Event
        </p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          {event.title}
        </h1>
        <p className="mt-1 text-sm uppercase tracking-[0.22em] text-muted-foreground">
          <time dateTime={event.startTime.toISOString()}>
            {formatDate(event.startTime)}
          </time>
          {" • "}
          <time dateTime={event.startTime.toISOString()}>
            {formatTime(event.startTime)}
          </time>
          {" • "}
          <span>{event.eventType}</span>
        </p>
      </header>

      <section className="mt-6 space-y-6" aria-label="Event details">
        <Card className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.5rem]">
          <CardContent className="pt-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <ImageWithFallback
                src={event.imageUrl}
                alt={event.imageAlt ?? `${event.title} image`}
                placeholderType="event"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <Card className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.5rem]">
          <CardHeader>
            <CardTitle className="font-display text-base text-white">
              Bar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <Link href={`/bars/${event.barSlug}`} className="hover:underline">
                {event.barName}
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.5rem]">
          <CardHeader>
            <CardTitle className="font-display text-base text-white">
              Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            {event.description ? (
              <p className="whitespace-pre-line text-sm text-muted-foreground">
                {event.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No description.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

import Link from "next/link";

import type { EventDto, EventType } from "@/domain/dtos/EventDto";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { eventService, parseEventTypeFilter } from "@/services/eventService";
import type { SelectHTMLAttributes } from "react";

export const revalidate = 3600;

type EventsPageProps = {
  searchParams?: Promise<{ type?: string; view?: string }>;
};

type ViewMode = "list" | "calendar";

const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string }> = [
  { value: "DJNight", label: "DJ Night" },
  { value: "LiveMusic", label: "Live Music" },
  { value: "LadiesNight", label: "Ladies Night" },
  { value: "HappyHour", label: "Happy Hour" },
];

const formatEventType = (eventType: EventType) => {
  const option = EVENT_TYPE_OPTIONS.find((opt) => opt.value === eventType);
  return option?.label ?? eventType;
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

const toIso = (date: Date) => date.toISOString();

const normalizeViewMode = (value: string | undefined): ViewMode => {
  if (value === "calendar") return "calendar";
  return "list";
};

const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => {
  return (
    <select
      {...props}
      className={
        "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm " +
        (props.className ?? "")
      }
    />
  );
};

const buildCalendar = (events: EventDto[]) => {
  const monthBase = events[0]?.startTime
    ? new Date(events[0].startTime)
    : new Date();
  const year = monthBase.getFullYear();
  const month = monthBase.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday=0
  const daysInMonth = lastDay.getDate();

  const cells: Array<{ date: Date | null; events: EventDto[] }> = [];

  for (let i = 0; i < startWeekday; i++) {
    cells.push({ date: null, events: [] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = events.filter((e) => {
      const d = new Date(e.startTime);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });

    cells.push({ date, events: dayEvents });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, events: [] });
  }

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
  }).format(firstDay);

  return { monthLabel, cells };
};

/**
 * Events listing page with a list and calendar view.
 */
export default async function EventsPage({ searchParams }: EventsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const type = parseEventTypeFilter(resolvedSearchParams.type ?? null);
  const view = normalizeViewMode(resolvedSearchParams.view);

  const events = await eventService.listUpcomingEvents({ type });

  const selectedTypeValue = resolvedSearchParams.type?.trim() || "";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Events</h1>

      <section className="mt-6" aria-label="Filters">
        <form role="search" className="flex flex-wrap items-end gap-3">
          <div className="w-full max-w-xs">
            <Label htmlFor="type">Event type</Label>
            <Select id="type" name="type" defaultValue={selectedTypeValue}>
              <option value="">All</option>
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-full max-w-xs">
            <Label htmlFor="view">View</Label>
            <Select id="view" name="view" defaultValue={view}>
              <option value="list">List</option>
              <option value="calendar">Calendar</option>
            </Select>
          </div>

          <Button type="submit">Apply</Button>
          <Button asChild variant="outline">
            <Link href="/events">Clear</Link>
          </Button>
        </form>
      </section>

      {events.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No events found.</p>
      ) : view === "calendar" ? (
        <section className="mt-6" aria-label="Calendar view">
          {(() => {
            const calendar = buildCalendar(events);

            return (
              <>
                <h2 className="text-sm font-medium">{calendar.monthLabel}</h2>

                <div className="mt-3 grid grid-cols-7 gap-2 text-xs">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div key={d} className="text-muted-foreground">
                        {d}
                      </div>
                    ),
                  )}

                  {calendar.cells.map((cell, index) => (
                    <div key={index} className="min-h-20 rounded-md border p-2">
                      {cell.date ? (
                        <div className="text-muted-foreground">
                          <time dateTime={toIso(cell.date)}>
                            {cell.date.getDate()}
                          </time>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">&nbsp;</div>
                      )}

                      {cell.events.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {cell.events.slice(0, 3).map((event) => (
                            <li key={event.id}>
                              <Link
                                href={`/events/${event.id}`}
                                className="hover:underline"
                              >
                                {event.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </section>
      ) : (
        <section className="mt-6 space-y-4" aria-label="Upcoming events">
          {events.map((event) => (
            <article key={event.id} className="rounded-md">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      href={`/events/${event.id}`}
                      className="hover:underline"
                    >
                      {event.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      <dt className="sr-only">Date</dt>
                      <dd>
                        <time dateTime={toIso(event.startTime)}>
                          {formatDate(event.startTime)}
                        </time>
                      </dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="sr-only">Time</dt>
                      <dd>
                        <time dateTime={toIso(event.startTime)}>
                          {formatTime(event.startTime)}
                        </time>
                      </dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="sr-only">Bar</dt>
                      <dd>{event.barName}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt className="sr-only">Type</dt>
                      <dd>{formatEventType(event.eventType)}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

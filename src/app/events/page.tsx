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
import Link from "next/link";

import type { EventType } from "@/domain/dtos/EventDto";
import { buildCalendar } from "./calendarUtils";
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

const toIso = (date: Date) => date.toISOString();

const normalizeViewMode = (): ViewMode => {
  // Always default to calendar view
  return "calendar";
};

/**
 * Events listing page with a list and calendar view.
 */
export default async function EventsPage({ searchParams }: EventsPageProps) {

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const type = parseEventTypeFilter(resolvedSearchParams.type ?? null);
  const view = normalizeViewMode();
  const events = await eventService.listUpcomingEvents({ type });
  const selectedTypeValue = resolvedSearchParams.type?.trim() || "";


  return (
    <main className="ppbn-page mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <header className="ppbn-hero-frame space-y-4 rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">Calendar</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">Events</h1>
      </header>

      <section className="mt-6 flex flex-wrap items-center gap-3" aria-label="Filters">
        <form role="search" className="flex flex-wrap items-end gap-3">
          <div className="w-full max-w-xs">
            <Label htmlFor="type">Event type</Label>
            <Select id="type" name="type" defaultValue={selectedTypeValue}>
              <option value="">All</option>
              {EVENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>
          <Button type="submit" className="bg-[#cc0000] text-white hover:bg-[#ff0000] rounded-sm">Apply</Button>
          <Button asChild variant="outline"><Link href="/events">Clear</Link></Button>
        </form>
        <Button asChild variant="outline" className="border-2 border-(--accent-red) text-white hover:bg-(--accent-red) hover:text-white transition-all">
          <Link href={`/events?type=&view=calendar&tonight=1`}>Tonight</Link>
        </Button>
      </section>

      {/* Always show calendar first */}
      <section className="mt-6" aria-label="Calendar view">
        {(() => {
          const calendar = buildCalendar(events);
          return (
            <>
              <h2 className="text-sm font-medium">{calendar.monthLabel}</h2>
              <div className="mt-3 grid grid-cols-7 gap-2 text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="text-muted-foreground">{d}</div>
                ))}
                {calendar.cells.map((cell, index) => (
                  <div key={index} className="glass-card min-h-20 rounded-md p-2">
                    {cell.date ? (
                      <div className="text-muted-foreground flex items-center gap-1">
                        <time dateTime={toIso(cell.date)}>{cell.date.getDate()}</time>
                        {cell.events.length > 0 && (<span className="inline-block h-2 w-2 rounded-full bg-[#cc0000]" />)}
                      </div>
                    ) : (<div className="text-muted-foreground">&nbsp;</div>)}
                    {cell.events.length > 0 ? (
                      <ul className="mt-2 space-y-1">
                        {cell.events.slice(0, 3).map((event) => (
                          <li key={event.id}>
                            <Link href={`/events/${event.id}`}>
                              <span className="badge-featured mr-2">{formatEventType(event.eventType)}</span>
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

      {/* Show events list below calendar */}
      <section className="mt-10" aria-label="Events list">
        <h2 className="font-display text-2xl text-white mb-4">Upcoming Events</h2>
        {events.length === 0 ? (
          <div className="mt-6 flex flex-col items-center justify-center rounded-xl glass-card p-10 text-center">
            <p className="text-2xl font-display text-white mb-2">No events</p>
            <p className="text-sm text-[#888]">Check back soon for new events.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="glass-card p-4 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="badge-featured">{formatEventType(event.eventType)}</span>
                  <span className="text-white font-display text-lg">{event.title}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(event.startTime)}</span>
                </div>
                <div className="text-sm text-muted-foreground">{event.description}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

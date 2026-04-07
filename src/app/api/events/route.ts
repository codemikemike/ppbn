import { NextResponse } from "next/server";

import { eventService, parseEventTypeFilter } from "@/services/eventService";

export const revalidate = 3600;

/**
 * GET /api/events
 * Lists upcoming/current approved events.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const type = parseEventTypeFilter(url.searchParams.get("type"));
    const barId = url.searchParams.get("barId") ?? undefined;

    const events = await eventService.listUpcomingEvents({ type, barId });

    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load events. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

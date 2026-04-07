import { NextResponse } from "next/server";

import { eventService } from "@/services/eventService";
import { NotFoundError } from "@/domain/errors/DomainErrors";

export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ id?: string }>;
};

/**
 * GET /api/events/:id
 * Gets a single upcoming/current approved event.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Event not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const event = await eventService.getUpcomingEventById(id);
    return NextResponse.json(event);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to load event. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

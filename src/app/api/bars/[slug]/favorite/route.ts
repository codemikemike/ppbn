import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { barService } from "@/services/barService";

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

/**
 * POST /api/bars/:slug/favorite
 *
 * Toggles whether the current user has favorited the bar.
 *
 * @param request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON containing `{ isFavorited: boolean }`.
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    void request;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required.", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const result = await barService.toggleFavorite(slug, session.user.id);
    if (!result) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to update favorites. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { barService } from "@/services/barService";

export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

/**
 * GET /api/bars/:slug/reviews
 * Returns approved, publicly visible reviews for a bar.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const reviews = await barService.listApprovedReviewsByBarSlug(slug);

    if (!reviews) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load reviews. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { barService } from "@/services/barService";
import { submitReviewSchema } from "@/domain/validations/reviewSchema";

/**
 * ISR revalidation window for bar reviews.
 * @returns Revalidation window in seconds.
 */
export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

/**
 * GET /api/bars/:slug/reviews
 * Returns approved, publicly visible reviews for a bar.
 *
 * @param request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON array of reviews.
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    void request;
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

/**
 * POST /api/bars/:slug/reviews
 *
 * Creates or updates a logged-in user's review for a bar.
 *
 * @param request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON containing the created/updated review.
 */
export async function POST(request: Request, context: RouteContext) {
  try {
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

    const json = (await request.json()) as unknown;
    const parsed = submitReviewSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid review.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const review = await barService.submitReview(
      slug,
      session.user.id,
      parsed.data,
    );
    if (!review) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(review);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to submit review. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

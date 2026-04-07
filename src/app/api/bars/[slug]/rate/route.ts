import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { barService } from "@/services/barService";
import { rateBarSchema } from "@/domain/validations/barSchema";

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

/**
 * POST /api/bars/:slug/rate
 *
 * Upserts a logged-in user's 1-5 star rating for a bar.
 *
 * @param request - Incoming HTTP request.
 * @param context - Route params context.
 * @returns JSON containing the updated average rating.
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
    const parsed = rateBarSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid rating.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const result = await barService.rateBar(slug, session.user.id, parsed.data);

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
        error: "Unable to save rating. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

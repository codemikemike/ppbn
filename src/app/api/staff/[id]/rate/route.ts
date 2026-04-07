import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { staffService } from "@/services/staffService";
import { rateStaffSchema } from "@/domain/validations/staffSchema";

type RouteContext = {
  params: Promise<{ id?: string }>;
};

/**
 * POST /api/staff/:id/rate
 *
 * Creates or updates the current user's rating for a staff profile.
 *
 * Body: `{ rating: number }` (1-5)
 *
 * @param request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON containing `{ averageRating, userRating }`.
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

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Staff profile not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const json = (await request.json()) as unknown;
    const parsed = rateStaffSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid rating.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const result = await staffService.rateStaff(
      id,
      session.user.id,
      parsed.data.rating,
    );

    if (!result) {
      return NextResponse.json(
        { error: "Staff profile not found.", code: "NOT_FOUND" },
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

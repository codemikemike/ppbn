import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { staffService } from "@/services/staffService";
import { tipStaffSchema } from "@/domain/validations/staffSchema";

type RouteContext = {
  params: Promise<{ id?: string }>;
};

/**
 * POST /api/staff/:id/tip
 *
 * Records a tip for the current user against a staff profile.
 *
 * Body: `{ amount: number, message?: string }`
 *
 * @param request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON containing `{ success: boolean, tipId: string }`.
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
    const parsed = tipStaffSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tip amount.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const result = await staffService.tipStaff(
      id,
      session.user.id,
      parsed.data.amount,
      parsed.data.message,
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
        error: "Unable to send tip. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

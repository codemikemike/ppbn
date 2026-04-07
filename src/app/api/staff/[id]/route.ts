import { NextResponse } from "next/server";

import { staffService } from "@/services/staffService";
import { NotFoundError } from "@/domain/errors/DomainErrors";

export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ id?: string }>;
};

/**
 * GET /api/staff/:id
 * Gets a single approved, publicly visible staff profile.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Staff profile not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const profile = await staffService.getApprovedStaffProfileById(id);
    return NextResponse.json(profile);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to load staff profile. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

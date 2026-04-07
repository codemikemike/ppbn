import { NextResponse } from "next/server";

import { staffService } from "@/services/staffService";

export const revalidate = 3600;

/**
 * GET /api/staff
 * Lists approved, publicly visible staff profiles.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const bar = url.searchParams.get("bar") ?? undefined;

    const profiles = await staffService.listApprovedStaffProfiles(bar);

    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load staff profiles. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

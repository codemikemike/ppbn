import { NextResponse } from "next/server";

import { tonightService } from "@/services/tonightService";

/**
 * ISR revalidation window for tonight data.
 */
export const revalidate = 3600;

/**
 * GET /api/tonight
 * Returns a combined payload for tonight: events today, open bars, featured bars, and live music venues.
 */
export async function GET() {
  try {
    const data = await tonightService.getTonightData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load tonight data. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

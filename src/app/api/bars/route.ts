import { NextResponse } from "next/server";
import { barService } from "@/services/barService";

export const revalidate = 3600;

export async function GET() {
  try {
    const bars = await barService.listApprovedBars();
    return NextResponse.json(bars);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load bars. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

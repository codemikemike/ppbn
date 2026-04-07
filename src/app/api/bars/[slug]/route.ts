import { NextResponse } from "next/server";
import { barService } from "@/services/barService";

export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const bar = await barService.getApprovedBarBySlug(slug);
    if (!bar) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(bar);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load bar. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

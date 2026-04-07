import { NextResponse } from "next/server";

import { blogService } from "@/services/blogService";

export const revalidate = 3600;

const parsePositiveInt = (value: string | null): number | null => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return null;
  return parsed;
};

/**
 * GET /api/blog
 * Returns published blog posts.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const page = parsePositiveInt(url.searchParams.get("page"));
    const limit = parsePositiveInt(url.searchParams.get("limit"));

    const posts = await blogService.listPublishedPosts(
      page ?? undefined,
      limit ?? undefined,
    );

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to load blog posts. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

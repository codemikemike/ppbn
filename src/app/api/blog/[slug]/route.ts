import { NextResponse } from "next/server";

import { blogService } from "@/services/blogService";
import { NotFoundError } from "@/domain/errors/DomainErrors";

export const revalidate = 3600;

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

/**
 * GET /api/blog/:slug
 * Returns a single published blog post.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        { error: "Post not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const post = await blogService.getPublishedPostBySlug(slug);
    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to load blog post. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { blogService } from "@/services/blogService";
import { authOptions } from "@/lib/auth";
import { createBlogCommentSchema } from "@/domain/validations/blogSchema";
import { NotFoundError } from "@/domain/errors/DomainErrors";

type RouteContext = {
  params: Promise<{ slug?: string }>;
};

/**
 * GET /api/blog/:slug/comments
 *
 * Lists approved comments for a published blog post.
 *
 * @param _request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON containing an array of `CommentDto`.
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

    const comments = await blogService.getComments(slug);
    return NextResponse.json(comments);
  } catch (err) {
    if (err instanceof NotFoundError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.statusCode },
      );
    }

    return NextResponse.json(
      {
        error: "Unable to load comments. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/blog/:slug/comments
 *
 * Creates a comment for a published blog post.
 *
 * Body: `{ content: string }` (min 5 chars)
 *
 * @param request - Incoming HTTP request.
 * @param context - Route context containing params.
 * @returns JSON containing the created `CommentDto`.
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
        { error: "Post not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    const json = (await request.json()) as unknown;
    const parsed = createBlogCommentSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid comment.", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const created = await blogService.addComment(
      slug,
      session.user.id,
      parsed.data.content,
    );

    if (!created) {
      return NextResponse.json(
        { error: "Post not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    return NextResponse.json(created);
  } catch {
    return NextResponse.json(
      {
        error: "Unable to submit comment. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

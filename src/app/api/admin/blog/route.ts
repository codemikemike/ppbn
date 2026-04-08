import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { adminService } from "@/services/adminService";
import { createBlogPostSchema } from "@/domain/validations/blogSchema";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "Admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parse = createBlogPostSchema.safeParse(data);
  if (!parse.success) {
    return NextResponse.json({ error: "Validation failed", details: parse.error.flatten() }, { status: 422 });
  }

  try {
    const post = await adminService.createBlogPost(session.user.id, parse.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create blog post";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

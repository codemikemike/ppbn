import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { adminService } from "@/services/adminService";
import { authOptions } from "@/lib/auth";
import { DomainError } from "@/domain/errors/DomainErrors";

type RouteContext = {
  params: Promise<{ id?: string }>;
};

/**
 * DELETE /api/admin/bars/:id
 *
 * Soft deletes a bar.
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    void request;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required.", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    if (session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Admin access required.", code: "FORBIDDEN" },
        { status: 403 },
      );
    }

    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: "Bar not found.", code: "NOT_FOUND" },
        { status: 404 },
      );
    }

    await adminService.deleteBar(session.user.id, id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode },
      );
    }

    console.error("Admin delete bar error:", error);

    return NextResponse.json(
      { error: "Unable to delete bar.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

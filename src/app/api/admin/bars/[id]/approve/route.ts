import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { adminService } from "@/services/adminService";
import { authOptions } from "@/lib/auth";
import { DomainError, ValidationError } from "@/domain/errors/DomainErrors";

type RouteContext = {
  params: Promise<{ id?: string }>;
};

/**
 * PATCH /api/admin/bars/:id/approve
 *
 * Approves or rejects a bar.
 */
export async function PATCH(request: Request, context: RouteContext) {
  try {
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

    const body = (await request.json()) as { approved: boolean };
    await adminService.setBarApproval(session.user.id, id, body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          ...(error instanceof ValidationError && { issues: error.issues }),
        },
        { status: error.statusCode },
      );
    }

    console.error("Admin bar approval error:", error);

    return NextResponse.json(
      { error: "Unable to update bar approval.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

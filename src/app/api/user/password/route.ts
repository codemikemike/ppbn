import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { authService } from "@/services/authService";
import { DomainError, ValidationError } from "@/domain/errors/DomainErrors";
import type { ChangePasswordDto } from "@/domain/dtos/ChangePasswordDto";

/**
 * PATCH /api/user/password
 *
 * Changes the current user's password.
 *
 * @param request - Incoming request.
 * @returns JSON containing `{ success: true }`.
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required.", code: "UNAUTHORIZED" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as ChangePasswordDto;
    await authService.changePassword(session.user.id, body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof DomainError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          ...(error instanceof ValidationError && {
            issues: error.issues,
          }),
        },
        { status: error.statusCode },
      );
    }

    console.error("Change password error:", error);

    return NextResponse.json(
      {
        error: "Unable to change password. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

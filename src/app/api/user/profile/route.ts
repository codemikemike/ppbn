import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { authService } from "@/services/authService";
import { DomainError, ValidationError } from "@/domain/errors/DomainErrors";
import type { UpdateUserProfileDto } from "@/domain/dtos/UpdateUserProfileDto";

/**
 * PATCH /api/user/profile
 *
 * Updates the current user's profile.
 *
 * @param request - Incoming request.
 * @returns JSON containing `{ user }`.
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

    const body = (await request.json()) as UpdateUserProfileDto;
    const user = await authService.updateUserProfile(session.user.id, body);

    return NextResponse.json({ user }, { status: 200 });
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

    console.error("Update profile error:", error);

    return NextResponse.json(
      {
        error: "Unable to update profile. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

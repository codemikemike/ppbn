import { NextResponse } from "next/server";

import { authService } from "@/services/authService";
import { DomainError, ValidationError } from "@/domain/errors/DomainErrors";

type ResetPasswordBody = {
  token?: string;
  password?: string;
};

/**
 * POST /api/auth/reset-password
 *
 * Resets a user password using a reset token.
 *
 * @param request - Incoming HTTP request.
 * @returns Success response when reset completed.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ResetPasswordBody;

    await authService.resetPassword(body.token ?? "", body.password ?? "");

    return NextResponse.json({
      message: "Password updated successfully. You can now log in.",
    });
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

    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        error: "Unable to reset password. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

import { authService } from "@/services/authService";
import { DomainError, ValidationError } from "@/domain/errors/DomainErrors";

type ForgotPasswordBody = {
  email?: string;
};

/**
 * POST /api/auth/forgot-password
 *
 * Generates a password reset token for an existing email address.
 *
 * Always returns success for valid input to avoid revealing whether an email exists.
 *
 * @param request - Incoming HTTP request.
 * @returns Generic success response.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ForgotPasswordBody;

    await authService.requestPasswordReset(body.email ?? "");

    return NextResponse.json({
      message:
        "If an account exists for that email, you will receive a reset link shortly.",
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

    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        error: "Unable to process request. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

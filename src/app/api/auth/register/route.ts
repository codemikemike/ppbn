import { NextResponse } from "next/server";
import { authService } from "@/services/authService";
import { DomainError, ValidationError } from "@/domain/errors/DomainErrors";
import type { RegisterDto } from "@/domain/dtos/RegisterDto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterDto;

    const user = await authService.registerUser(body);

    return NextResponse.json(
      {
        user,
        message: "Account created successfully! Welcome to PPBN.",
      },
      { status: 201 },
    );
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

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";

const COOKIE_NAMES_TO_CLEAR = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.csrf-token",
  "__Host-next-auth.csrf-token",
  "next-auth.callback-url",
  "__Secure-next-auth.callback-url",
] as const;

/**
 * Logout endpoint.
 *
 * Clears NextAuth cookies. Safe to call even when already logged out.
 */
export async function POST() {
  try {
    const response = NextResponse.json({ ok: true });

    for (const name of COOKIE_NAMES_TO_CLEAR) {
      response.cookies.set({
        name,
        value: "",
        expires: new Date(0),
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: "Logout failed. Please try again.", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}

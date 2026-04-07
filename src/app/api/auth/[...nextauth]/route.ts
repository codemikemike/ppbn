import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

/**
 * NextAuth handler for GET requests (App Router).
 * @returns A NextAuth response.
 */
export const GET = handler;

/**
 * NextAuth handler for POST requests (App Router).
 * @returns A NextAuth response.
 */
export const POST = handler;

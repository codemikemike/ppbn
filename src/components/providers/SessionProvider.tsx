"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

/**
 * App-level NextAuth session provider.
 * @param props Provider props.
 * @returns Session context provider for client components.
 */
export const SessionProvider = ({ children }: Props) => {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
};

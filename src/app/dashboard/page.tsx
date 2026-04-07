import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

/**
 * Dashboard page (placeholder).
 * Redirects to /login when unauthenticated.
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Welcome back, {session.user.email}
      </p>
    </main>
  );
}

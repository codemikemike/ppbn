import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

/**
 * Dashboard page.
 * Redirects to /login when unauthenticated.
 */
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const stats = await authService.getDashboardStats(session.user.id);

  const displayName = session.user.name ?? session.user.email;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-6 text-sm text-muted-foreground">
        Welcome back, {displayName}
      </p>

      <section className="mt-8" aria-labelledby="dashboard-stats">
        <h2 id="dashboard-stats" className="sr-only">
          Stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{stats.reviewsCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Favorite bars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {stats.favoriteBarsCount}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Staff ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">
                {stats.staffRatingsCount}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="dashboard-links">
        <h2 id="dashboard-links" className="text-lg font-semibold">
          Quick links
        </h2>
        <ul className="mt-3 space-y-2">
          <li>
            <Link
              className="text-sm font-medium hover:underline"
              href="/dashboard/reviews"
            >
              My reviews
            </Link>
          </li>
          <li>
            <Link
              className="text-sm font-medium hover:underline"
              href="/dashboard/favorites"
            >
              Favorites
            </Link>
          </li>
          <li>
            <Link
              className="text-sm font-medium hover:underline"
              href="/dashboard/settings"
            >
              Settings
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

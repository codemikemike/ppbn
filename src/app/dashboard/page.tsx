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
    <main className="ppbn-page mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="ppbn-hero mb-8">
        <p className="ppbn-kicker">Member area</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Welcome back, {displayName}
        </p>
      </header>

      <section className="mt-8" aria-labelledby="dashboard-stats">
        <h2 id="dashboard-stats" className="sr-only">
          Stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="glass-card glow-red border-none rounded-[1.5rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-black text-white">
                {stats.reviewsCount}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card glow-red border-none rounded-[1.5rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Favorite bars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-black text-white">
                {stats.favoriteBarsCount}
              </p>
            </CardContent>
          </Card>
          <Card className="glass-card glow-red border-none rounded-[1.5rem]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Staff ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-black text-white">
                {stats.staffRatingsCount}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-8" aria-labelledby="dashboard-links">
        <h2
          id="dashboard-links"
          className="font-display text-2xl font-black uppercase tracking-[-0.06em] text-white"
        >
          Quick links
        </h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          <li>
            <Link
              className="glass-card block rounded-2xl px-4 py-4 text-sm font-medium text-white transition-all duration-300 hover:glow-red"
              href="/dashboard/reviews"
            >
              My reviews
            </Link>
          </li>
          <li>
            <Link
              className="glass-card block rounded-2xl px-4 py-4 text-sm font-medium text-white transition-all duration-300 hover:glow-red"
              href="/dashboard/favorites"
            >
              Favorites
            </Link>
          </li>
          <li>
            <Link
              className="glass-card block rounded-2xl px-4 py-4 text-sm font-medium text-white transition-all duration-300 hover:glow-red"
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

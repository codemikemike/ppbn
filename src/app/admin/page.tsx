import { adminService } from "@/services/adminService";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

/**
 * Admin overview page.
 */
export default async function AdminOverviewPage() {
  const stats = await adminService.getOverviewStats();

  return (
    <main className="ppbn-page space-y-6">
      <header className="ppbn-hero space-y-2">
        <p className="ppbn-kicker">Night control</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Admin Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Site-wide health and moderation queue.
        </p>
      </header>

      <Card className="glass-card glow-red border-none rounded-[1.75rem]">
        <CardHeader>
          <h2 className="font-display text-lg font-black uppercase tracking-[-0.06em] text-white">
            Stats
          </h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-card rounded-2xl p-4">
              <dt className="text-xs text-muted-foreground">Total bars</dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">
                {stats.totalBars}
              </dd>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <dt className="text-xs text-muted-foreground">Pending bars</dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">
                {stats.pendingBars}
              </dd>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <dt className="text-xs text-muted-foreground">Total users</dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">
                {stats.totalUsers}
              </dd>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <dt className="text-xs text-muted-foreground">Total reviews</dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">
                {stats.totalReviews}
              </dd>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <dt className="text-xs text-muted-foreground">Pending reviews</dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">
                {stats.pendingReviews}
              </dd>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <dt className="text-xs text-muted-foreground">
                Total blog posts
              </dt>
              <dd className="mt-1 font-display text-2xl font-black text-white">
                {stats.totalBlogPosts}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}

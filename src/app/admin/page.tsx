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
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground">
          Site-wide health and moderation queue.
        </p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-base font-medium">Stats</h2>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-md border p-3">
              <dt className="text-xs text-muted-foreground">Total bars</dt>
              <dd className="mt-1 text-lg font-medium">{stats.totalBars}</dd>
            </div>
            <div className="rounded-md border p-3">
              <dt className="text-xs text-muted-foreground">Pending bars</dt>
              <dd className="mt-1 text-lg font-medium">{stats.pendingBars}</dd>
            </div>
            <div className="rounded-md border p-3">
              <dt className="text-xs text-muted-foreground">Total users</dt>
              <dd className="mt-1 text-lg font-medium">{stats.totalUsers}</dd>
            </div>
            <div className="rounded-md border p-3">
              <dt className="text-xs text-muted-foreground">Total reviews</dt>
              <dd className="mt-1 text-lg font-medium">{stats.totalReviews}</dd>
            </div>
            <div className="rounded-md border p-3">
              <dt className="text-xs text-muted-foreground">Pending reviews</dt>
              <dd className="mt-1 text-lg font-medium">
                {stats.pendingReviews}
              </dd>
            </div>
            <div className="rounded-md border p-3">
              <dt className="text-xs text-muted-foreground">
                Total blog posts
              </dt>
              <dd className="mt-1 text-lg font-medium">
                {stats.totalBlogPosts}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </main>
  );
}

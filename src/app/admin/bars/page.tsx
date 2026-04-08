import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { adminService } from "@/services/adminService";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

const setApproval = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const barId = formData.get("barId");
  const approved = formData.get("approved");

  if (typeof barId !== "string" || !barId.trim()) return;
  if (approved !== "true" && approved !== "false") return;

  await adminService.setBarApproval(session.user.id, barId, {
    approved: approved === "true",
  });

  revalidatePath("/admin/bars");
};

const deleteBar = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const barId = formData.get("barId");
  if (typeof barId !== "string" || !barId.trim()) return;

  await adminService.deleteBar(session.user.id, barId);
  revalidatePath("/admin/bars");
};

/**
 * Admin bars page.
 */
export default async function AdminBarsPage() {
  const bars = await adminService.listBars();

  return (
    <main className="ppbn-page space-y-6">
      <header className="ppbn-hero space-y-2">
        <p className="ppbn-kicker">Moderation</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Bars
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve, reject, and delete bars.
        </p>
      </header>

      <Card className="glass-card glow-red border-none rounded-[1.75rem]">
        <CardHeader>
          <h2 className="font-display text-lg font-black uppercase tracking-[-0.06em] text-white">
            All bars
          </h2>
        </CardHeader>
        <CardContent>
          {bars.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bars found.</p>
          ) : (
            <ul className="space-y-3">
              {bars.map((bar) => (
                <li
                  key={bar.id}
                  className="glass-card space-y-2 rounded-2xl p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {bar.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bar.area} · {bar.category} ·{" "}
                        {bar.isApproved ? "Approved" : "Pending"}
                        {bar.deletedAt ? " · Deleted" : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/dashboard/bars/${bar.slug}/edit`}
                        className="text-xs font-medium text-(--accent-gold) hover:text-white"
                      >
                        Edit
                      </Link>

                      <form action={setApproval}>
                        <input type="hidden" name="barId" value={bar.id} />
                        <input type="hidden" name="approved" value="true" />
                        <Button
                          type="submit"
                          size="sm"
                          className="rounded-sm border border-[rgba(255,255,255,0.14)] bg-transparent text-white hover:bg-[rgba(204,0,0,0.2)] hover:text-white"
                        >
                          Approve
                        </Button>
                      </form>

                      <form action={setApproval}>
                        <input type="hidden" name="barId" value={bar.id} />
                        <input type="hidden" name="approved" value="false" />
                        <Button
                          type="submit"
                          size="sm"
                          className="rounded-sm border border-[rgba(255,255,255,0.14)] bg-transparent text-white hover:bg-[rgba(204,0,0,0.2)] hover:text-white"
                        >
                          Reject
                        </Button>
                      </form>

                      <form action={deleteBar}>
                        <input type="hidden" name="barId" value={bar.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

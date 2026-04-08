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

  const staffProfileId = formData.get("staffProfileId");
  const approved = formData.get("approved");

  if (typeof staffProfileId !== "string" || !staffProfileId.trim()) return;
  if (approved !== "true" && approved !== "false") return;

  await adminService.setStaffApproval(session.user.id, staffProfileId, {
    approved: approved === "true",
  });

  revalidatePath("/admin/staff");
};

const deleteStaffProfile = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const staffProfileId = formData.get("staffProfileId");
  if (typeof staffProfileId !== "string" || !staffProfileId.trim()) return;

  await adminService.deleteStaffProfile(session.user.id, staffProfileId);
  revalidatePath("/admin/staff");
};

/**
 * Admin staff page.
 */
export default async function AdminStaffPage() {
  const staffProfiles = await adminService.listStaffProfiles();

  return (
    <main className="ppbn-page space-y-6">
      <header className="ppbn-hero space-y-2">
        <p className="ppbn-kicker">Moderation</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Staff
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve, reject, and delete staff profiles.
        </p>
      </header>

      <Card className="glass-card glow-red border-none rounded-[1.75rem]">
        <CardHeader>
          <h2 className="font-display text-lg font-black uppercase tracking-[-0.06em] text-white">
            All staff profiles
          </h2>
        </CardHeader>
        <CardContent>
          {staffProfiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No staff profiles found.
            </p>
          ) : (
            <ul className="space-y-3">
              {staffProfiles.map((staff) => (
                <li key={staff.id} className="glass-card rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        <Link
                          href={`/staff/${staff.slug}`}
                          className="text-white hover:text-(--accent-gold)"
                        >
                          {staff.displayName}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {staff.isActive ? "Active" : "Inactive"} ·{" "}
                        {staff.isApproved ? "Approved" : "Pending"}
                        {staff.deletedAt ? " · Deleted" : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <form action={setApproval}>
                        <input
                          type="hidden"
                          name="staffProfileId"
                          value={staff.id}
                        />
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
                        <input
                          type="hidden"
                          name="staffProfileId"
                          value={staff.id}
                        />
                        <input type="hidden" name="approved" value="false" />
                        <Button
                          type="submit"
                          size="sm"
                          className="rounded-sm border border-[rgba(255,255,255,0.14)] bg-transparent text-white hover:bg-[rgba(204,0,0,0.2)] hover:text-white"
                        >
                          Reject
                        </Button>
                      </form>

                      <form action={deleteStaffProfile}>
                        <input
                          type="hidden"
                          name="staffProfileId"
                          value={staff.id}
                        />
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

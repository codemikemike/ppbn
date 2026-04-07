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
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Staff</h1>
        <p className="text-sm text-muted-foreground">
          Approve, reject, and delete staff profiles.
        </p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-base font-medium">All staff profiles</h2>
        </CardHeader>
        <CardContent>
          {staffProfiles.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No staff profiles found.
            </p>
          ) : (
            <ul className="space-y-3">
              {staffProfiles.map((staff) => (
                <li key={staff.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        <Link
                          href={`/staff/${staff.slug}`}
                          className="hover:underline"
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
                        <Button type="submit" size="sm" variant="outline">
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
                        <Button type="submit" size="sm" variant="outline">
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

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import type { UserRole } from "@/domain/dtos/UserRole";
import { adminService } from "@/services/adminService";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

const setUserRole = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const userId = formData.get("userId");
  const role = formData.get("role");

  if (typeof userId !== "string" || !userId.trim()) return;
  if (typeof role !== "string" || !role.trim()) return;

  await adminService.setUserRole(session.user.id, userId, {
    role: role as UserRole,
  });

  revalidatePath("/admin/users");
};

const deleteUser = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId.trim()) return;

  await adminService.deleteUser(session.user.id, userId);
  revalidatePath("/admin/users");
};

/**
 * Admin users page.
 */
export default async function AdminUsersPage() {
  const [users, roles] = await Promise.all([
    adminService.listUsers(),
    adminService.listAssignableRoles(),
  ]);

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Change roles and soft delete users.
        </p>
      </header>

      <Card>
        <CardHeader>
          <h2 className="text-base font-medium">All users</h2>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <ul className="space-y-3">
              {users.map((user) => (
                <li key={user.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.name ?? "No name"} · Role: {user.role}
                        {user.deletedAt ? " · Deleted" : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <form
                        action={setUserRole}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="userId" value={user.id} />
                        <label className="sr-only" htmlFor={`role-${user.id}`}>
                          Role
                        </label>
                        <select
                          id={`role-${user.id}`}
                          name="role"
                          defaultValue={user.role}
                          className="h-9 rounded-md border bg-background px-2 text-sm"
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <Button type="submit" size="sm" variant="outline">
                          Save
                        </Button>
                      </form>

                      <form action={deleteUser}>
                        <input type="hidden" name="userId" value={user.id} />
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

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { SettingsClient } from "@/components/dashboard/SettingsClient";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

/**
 * Settings dashboard page.
 *
 * @returns Settings UI for updating profile and password.
 */
export default async function DashboardSettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="mt-8 space-y-6">
        <SettingsClient
          initialName={session.user.name ?? ""}
          email={session.user.email}
        />
      </div>
    </main>
  );
}

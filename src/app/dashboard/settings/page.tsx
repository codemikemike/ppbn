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
    <main className="ppbn-page mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="ppbn-hero mb-8">
        <p className="ppbn-kicker">Account control</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Settings
        </h1>
      </header>

      <div className="mt-8 space-y-6">
        <SettingsClient
          initialName={session.user.name ?? ""}
          email={session.user.email}
        />
      </div>
    </main>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

/**
 * Forces this layout to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

/**
 * Admin layout with role-gated navigation.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-10">
      <aside className="w-full max-w-64">
        <nav aria-label="Admin navigation" className="rounded-md border p-4">
          <h2 className="text-sm font-medium">Admin</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/admin" className="hover:underline">
                Overview
              </Link>
            </li>
            <li>
              <Link href="/admin/bars" className="hover:underline">
                Bars
              </Link>
            </li>
            <li>
              <Link href="/admin/reviews" className="hover:underline">
                Reviews
              </Link>
            </li>
            <li>
              <Link href="/admin/users" className="hover:underline">
                Users
              </Link>
            </li>
            <li>
              <Link href="/admin/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/admin/staff" className="hover:underline">
                Staff
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

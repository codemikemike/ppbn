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
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-10 lg:px-8">
      <aside className="w-full max-w-72 shrink-0">
        <nav
          aria-label="Admin navigation"
          className="ppbn-glass sticky top-24 rounded-[1.5rem] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-gold)]">
            Admin
          </p>
          <h2 className="font-display mt-2 text-2xl font-black uppercase tracking-[-0.06em] text-white">
            Night Control
          </h2>
          <ul className="mt-6 space-y-2 text-sm">
            {[
              ["/admin", "Overview"],
              ["/admin/bars", "Bars"],
              ["/admin/reviews", "Reviews"],
              ["/admin/users", "Users"],
              ["/admin/blog", "Blog"],
              ["/admin/staff", "Staff"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="ppbn-navlink w-full justify-start">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

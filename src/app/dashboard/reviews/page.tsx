import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { authService } from "@/services/authService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

/**
 * My reviews dashboard page.
 *
 * @returns The current user's reviews list.
 */
export default async function DashboardReviewsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const reviews = await authService.listMyReviews(session.user.id);

  return (
    <main className="ppbn-page mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Card className="glass-card glow-red border-none rounded-[1.75rem]">
        <CardHeader>
          <CardTitle className="font-display text-2xl font-black uppercase tracking-[-0.06em] text-white">
            My reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have not written any reviews yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li key={review.id} className="glass-card rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/bars/${review.bar.slug}`}
                      className="font-medium text-white transition-colors hover:text-(--accent-gold)"
                    >
                      {review.bar.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Rating: {review.rating}/5
                    </p>
                  </div>

                  {review.content.trim().length > 0 ? (
                    <p className="mt-2 text-sm leading-relaxed text-white">
                      {review.content}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-muted-foreground">
                      No comment.
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

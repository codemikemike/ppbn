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
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>My reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have not written any reviews yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li key={review.id} className="rounded-md border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/bars/${review.bar.slug}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {review.bar.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      Rating: {review.rating}/5
                    </p>
                  </div>

                  {review.content.trim().length > 0 ? (
                    <p className="mt-2 text-sm leading-relaxed">
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

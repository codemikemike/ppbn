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

  const reviewId = formData.get("reviewId");
  const approved = formData.get("approved");

  if (typeof reviewId !== "string" || !reviewId.trim()) return;
  if (approved !== "true" && approved !== "false") return;

  await adminService.setReviewApproval(session.user.id, reviewId, {
    approved: approved === "true",
  });

  revalidatePath("/admin/reviews");
};

const deleteReview = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const reviewId = formData.get("reviewId");
  if (typeof reviewId !== "string" || !reviewId.trim()) return;

  await adminService.deleteReview(session.user.id, reviewId);
  revalidatePath("/admin/reviews");
};

/**
 * Admin reviews page.
 */
export default async function AdminReviewsPage() {
  const reviews = await adminService.listReviews();

  return (
    <main className="ppbn-page space-y-6">
      <header className="ppbn-hero space-y-2">
        <p className="ppbn-kicker">Moderation</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Reviews
        </h1>
        <p className="text-sm text-muted-foreground">
          Approve, reject, and delete reviews.
        </p>
      </header>

      <Card className="glass-card glow-red border-none rounded-[1.75rem]">
        <CardHeader>
          <h2 className="font-display text-lg font-black uppercase tracking-[-0.06em] text-white">
            All reviews
          </h2>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews found.</p>
          ) : (
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="glass-card space-y-2 rounded-2xl p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="text-sm font-medium text-white">
                        {review.rating} stars ·{" "}
                        <Link
                          href={`/bars/${review.bar.slug}`}
                          className="font-medium text-(--accent-gold) hover:text-white"
                        >
                          {review.bar.name}
                        </Link>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {review.user.email} ·{" "}
                        {review.isApproved ? "Approved" : "Pending"}
                        {review.deletedAt ? " · Deleted" : ""}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {review.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <form action={setApproval}>
                        <input
                          type="hidden"
                          name="reviewId"
                          value={review.id}
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
                          name="reviewId"
                          value={review.id}
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

                      <form action={deleteReview}>
                        <input
                          type="hidden"
                          name="reviewId"
                          value={review.id}
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

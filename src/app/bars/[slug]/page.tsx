import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { barService } from "@/services/barService";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import StarRating from "@/components/bars/StarRating";
import ReviewForm from "@/components/bars/ReviewForm";
import { authOptions } from "@/lib/auth";

/**
 * ISR revalidation window for the bar detail page.
 * @returns Revalidation window in seconds.
 */
export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const formatAverageRating = (averageRating: number | null) => {
  if (averageRating === null) return "No ratings yet";
  return averageRating.toFixed(1);
};

const formatReviewDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

const StaticStarRating = ({ rating }: { rating: number }) => {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < clamped;
        return (
          <Star
            key={index}
            className={
              filled
                ? "h-4 w-4 fill-foreground text-foreground"
                : "h-4 w-4 text-muted-foreground"
            }
          />
        );
      })}
    </div>
  );
};

/**
 * Bar detail page.
 *
 * @param props - Next.js page props.
 * @param props.params - Route params containing the bar slug.
 * @returns The bar detail UI.
 */
export default async function BarDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const bar = await barService.getApprovedBarBySlug(slug);
  if (!bar) notFound();

  const session = await getServerSession(authOptions);
  const currentUserRating = session
    ? (bar.reviews.find((review) => review.user.id === session.user.id)
        ?.rating ?? null)
    : null;
  const visibleReviews = bar.reviews.filter(
    (review) => review.content.trim().length > 0,
  );

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <ImageWithFallback
                src={bar.primaryImageUrl}
                alt={`${bar.name} photo`}
                placeholderType="bar"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{bar.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Area</dt>
                <dd>{bar.area}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd>{bar.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Opening hours</dt>
                <dd>{bar.openingHours ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Average rating</dt>
                <dd className="flex items-center gap-2">
                  <span>{formatAverageRating(bar.averageRating)}</span>
                  {bar.averageRating !== null ? (
                    <StaticStarRating rating={bar.averageRating} />
                  ) : null}
                </dd>
              </div>
            </dl>

            <section className="mt-6" aria-label="Rate this bar">
              <h2 className="text-sm font-medium">Your rating</h2>
              {session ? (
                <StarRating
                  barSlug={bar.slug}
                  initialRating={currentUserRating}
                />
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Login to rate this bar
                </p>
              )}
            </section>

            {bar.description ? (
              <div className="mt-6">
                <h2 className="text-sm font-medium">Description</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {bar.description}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                Total reviews:{" "}
                <span className="font-medium">{visibleReviews.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Average</span>
                <span className="text-sm font-medium">
                  {bar.averageRating === null
                    ? "—"
                    : bar.averageRating.toFixed(1)}
                </span>
                {bar.averageRating !== null ? (
                  <StaticStarRating rating={bar.averageRating} />
                ) : null}
              </div>
            </div>

            {visibleReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {visibleReviews.map((review) => (
                  <article key={review.id} className="rounded-md border p-4">
                    <header className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {review.user.name ?? "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatReviewDate(review.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {review.rating}/5
                        </span>
                        <StaticStarRating rating={review.rating} />
                      </div>
                    </header>

                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </article>
                ))}
              </div>
            )}

            <ReviewForm barSlug={bar.slug} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

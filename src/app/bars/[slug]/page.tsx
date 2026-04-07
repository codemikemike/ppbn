import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { barService } from "@/services/barService";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

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

const StarRating = ({ rating }: { rating: number }) => {
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

export default async function BarDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const bar = await barService.getApprovedBarBySlug(slug);
  if (!bar) notFound();

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
                    <StarRating rating={bar.averageRating} />
                  ) : null}
                </dd>
              </div>
            </dl>

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
                <span className="font-medium">{bar.reviews.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Average</span>
                <span className="text-sm font-medium">
                  {bar.averageRating === null
                    ? "—"
                    : bar.averageRating.toFixed(1)}
                </span>
                {bar.averageRating !== null ? (
                  <StarRating rating={bar.averageRating} />
                ) : null}
              </div>
            </div>

            {bar.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {bar.reviews.map((review) => (
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
                        <StarRating rating={review.rating} />
                      </div>
                    </header>

                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

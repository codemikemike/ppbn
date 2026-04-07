import { notFound } from "next/navigation";

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
                <dd>{formatAverageRating(bar.averageRating)}</dd>
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
            {bar.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {bar.reviews.map((review) => (
                  <div key={review.id} className="rounded-md border p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          {review.title ?? "Review"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.user.name ?? "Anonymous"}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {review.rating}/5
                      </div>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {review.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

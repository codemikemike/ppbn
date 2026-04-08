import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { barService } from "@/services/barService";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import StarRating from "@/components/bars/StarRating";
import FavoriteButton from "@/components/bars/FavoriteButton";
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
                ? "h-4 w-4 text-[#d4af37] fill-[#d4af37]"
                : "h-4 w-4 text-[#444]"
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
  const isFavorited = session
    ? (await barService.getUserFavorites(session.user.id)).some(
        (favorite) => favorite.id === bar.id,
      )
    : false;
  const currentUserRating = session
    ? (bar.reviews.find((review) => review.user.id === session.user.id)
        ?.rating ?? null)
    : null;
  const visibleReviews = bar.reviews.filter(
    (review) => review.content.trim().length > 0,
  );

  const getAvatarInitials = (value: string | null): string => {
    const normalized = (value ?? "").trim();
    if (!normalized) return "?";

    const parts = normalized.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "?";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <main className="ppbn-page bg-[#0a0a0a] pb-16">
      <section aria-label="Bar hero" className="relative">
        <div className="relative h-90 w-full overflow-hidden lg:h-115">
          <ImageWithFallback
            src={bar.primaryImageUrl}
            alt={`${bar.name} photo`}
            placeholderType="bar"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"
            aria-hidden="true"
          />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          <div className="-mt-16 glass-card glow-red rounded-[2rem] p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display truncate text-3xl font-black uppercase tracking-[-0.08em] text-white sm:text-5xl">
                    {bar.name}
                  </h1>
                  {bar.averageRating !== null ? (
                    <span className="text-xs uppercase tracking-[0.22em] text-(--accent-gold)">
                      {bar.averageRating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted-foreground">
                  {bar.area} · {bar.category}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FavoriteButton
                  barSlug={bar.slug}
                  initialIsFavorited={isFavorited}
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
                  Average
                </span>
                <span className="text-sm font-medium text-white">
                  {formatAverageRating(bar.averageRating)}
                </span>
                {bar.averageRating !== null ? (
                  <StaticStarRating rating={bar.averageRating} />
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">
                {bar.openingHours ? `Hours: ${bar.openingHours}` : "Hours: —"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 lg:px-8">
        <Card className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.75rem]">
          <CardContent className="pt-6">
            <div className="ppbn-tabs" aria-label="Bar tabs">
              <input
                id="ppbn-tab-info"
                name="ppbn-tab"
                type="radio"
                defaultChecked
              />
              <label className="ppbn-tab" htmlFor="ppbn-tab-info">
                Info
              </label>

              <input id="ppbn-tab-reviews" name="ppbn-tab" type="radio" />
              <label className="ppbn-tab" htmlFor="ppbn-tab-reviews">
                Reviews
              </label>

              <input id="ppbn-tab-gallery" name="ppbn-tab" type="radio" />
              <label className="ppbn-tab" htmlFor="ppbn-tab-gallery">
                Gallery
              </label>

              <div className="ppbn-tab-panels">
                <section className="ppbn-tab-panel" data-panel="info">
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
                    <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
                      Your rating
                    </h2>
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
                      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
                        Description
                      </h2>
                      <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                        {bar.description}
                      </p>
                    </div>
                  ) : null}
                </section>

                <section className="ppbn-tab-panel" data-panel="reviews">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Total reviews:{" "}
                      <span className="font-medium">
                        {visibleReviews.length}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Average
                      </span>
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
                    <div className="mt-4">
                      <div className="glass-card bg-[#181818] border border-border/70 rounded-xl p-6 flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-white mb-2">
                          No reviews yet
                        </p>
                        <p className="text-sm text-[#888]">
                          Be the first to review this bar!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {visibleReviews.map((review) => (
                        <article
                          key={review.id}
                          className="glass-card border border-border/70 rounded-xl p-6"
                        >
                          <header className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <div className="ppbn-avatar" aria-hidden="true">
                                <span className="text-xs font-semibold">
                                  {getAvatarInitials(review.user.name)}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <p className="font-display text-base font-bold uppercase tracking-[0.12em] text-white">
                                  {review.user.name ?? "Anonymous"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatReviewDate(review.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StaticStarRating rating={review.rating} />
                            </div>
                          </header>
                          <p className="mt-3 whitespace-pre-line text-sm text-[#888]">
                            {review.content}
                          </p>
                        </article>
                      ))}
                    </div>
                  )}

                  <div className="mt-6">
                    <ReviewForm barSlug={bar.slug} />
                  </div>
                </section>

                <section className="ppbn-tab-panel" data-panel="gallery">
                  {bar.images.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No photos yet.
                    </p>
                  ) : (
                    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {bar.images.map((image) => (
                        <li key={image.id}>
                          <div className="relative aspect-video overflow-hidden rounded-xl border border-border/70">
                            <ImageWithFallback
                              src={image.url}
                              alt={image.altText ?? `${bar.name} photo`}
                              placeholderType="bar"
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              <section className="mt-6 space-y-4" aria-label="Location map">
                <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
                  Map
                </h2>
                <iframe
                  title={`${bar.name} location map`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(`${bar.name}, ${bar.area}, Phnom Penh`)}&output=embed`}
                />
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

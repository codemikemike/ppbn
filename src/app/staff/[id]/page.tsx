import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { staffService } from "@/services/staffService";
import { NotFoundError } from "@/domain/errors/DomainErrors";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ id: string }>;
};

const formatReviewDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

const getInitials = (name: string) => {
  const parts = name
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean);

  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
};

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

/**
 * Staff profile detail page.
 */
export default async function StaffProfilePage({ params }: PageProps) {
  const { id } = await params;

  let profile;
  try {
    profile = await staffService.getApprovedStaffProfileById(id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const initials = getInitials(profile.displayName);
  const gallery =
    profile.galleryImageUrls.length > 0 ? profile.galleryImageUrls : [null];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <nav aria-label="Breadcrumb">
        <Link
          href="/staff"
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to Staff
        </Link>
      </nav>

      <header className="mt-4">
        <h1 className="text-2xl font-semibold">{profile.displayName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {profile.position ?? "—"}
          {profile.currentBar ? ` • ${profile.currentBar}` : ""}
        </p>
      </header>

      <section className="mt-6 space-y-6" aria-label="Staff profile">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-md border">
                <ImageWithFallback
                  src={profile.photoUrl}
                  alt={
                    profile.photoAlt ?? `${profile.displayName} profile photo`
                  }
                  placeholderType="staff"
                  fill
                  className="object-cover"
                  sizes="112px"
                  priority
                />
              </div>

              <dl className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Initials</dt>
                  <dd className="font-medium">{initials || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Role</dt>
                  <dd>{profile.position ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Bar</dt>
                  <dd>{profile.currentBar ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Average rating</dt>
                  <dd className="flex items-center gap-2">
                    <span>
                      {profile.averageRating === null
                        ? "—"
                        : profile.averageRating.toFixed(1)}
                    </span>
                    {profile.averageRating !== null ? (
                      <StarRating rating={profile.averageRating} />
                    ) : null}
                    <span className="text-muted-foreground">
                      ({profile.ratingCount})
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            {profile.bio ? (
              <div className="mt-6">
                <h2 className="text-sm font-medium">Description</h2>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                  {profile.bio}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <section aria-label="Gallery">
          <h2 className="text-sm font-medium">Gallery</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((src, index) => (
              <Card key={`${String(src)}-${index}`}>
                <CardContent className="pt-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-md">
                    <ImageWithFallback
                      src={typeof src === "string" ? src : null}
                      alt={`${profile.displayName} gallery image ${index + 1}`}
                      placeholderType="staff"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 240px"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="Reviews and comments">
          <h2 className="text-sm font-medium">Reviews and comments</h2>

          {profile.ratings.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {profile.ratings.map((rating) => (
                <article key={rating.id} className="rounded-md border p-4">
                  <header className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {rating.userName ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatReviewDate(rating.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {rating.rating}/5
                      </span>
                      <StarRating rating={rating.rating} />
                    </div>
                  </header>

                  {rating.comment ? (
                    <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                      {rating.comment}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      No comment.
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

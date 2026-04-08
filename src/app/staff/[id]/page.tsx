import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import StaffStarRating from "@/components/staff/StaffStarRating";
import TipButton from "@/components/staff/TipButton";
import { staffService } from "@/services/staffService";
import { NotFoundError } from "@/domain/errors/DomainErrors";
import { authOptions } from "@/lib/auth";

/**
 * ISR revalidation window for the staff profile detail page.
 * @returns Revalidation window in seconds.
 */
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
 * Staff profile detail page.
 *
 * @param props - Next.js page props.
 * @param props.params - Route params containing the staff profile id.
 * @returns The staff profile detail UI.
 */
export default async function StaffProfilePage({ params }: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  let profile;
  try {
    profile = await staffService.getApprovedStaffProfileById(id);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const userRating = session
    ? await staffService.getUserRating(id, session.user.id)
    : null;

  const initials = getInitials(profile.displayName);
  const gallery =
    profile.galleryImageUrls.length > 0 ? profile.galleryImageUrls : [null];

  return (
    <main className="ppbn-page mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <nav aria-label="Breadcrumb">
        <Link
          href="/staff"
          className="text-sm text-muted-foreground hover:text-white"
        >
          Back to Staff
        </Link>
      </nav>

      <header className="ppbn-hero-frame mt-4 space-y-4 rounded-[2rem] p-6 sm:p-8">
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          {profile.displayName}
        </h1>
        <p className="mt-1 text-sm uppercase tracking-[0.22em] text-muted-foreground">
          {profile.position ?? "—"}
          {profile.currentBar ? ` • ${profile.currentBar}` : ""}
        </p>
      </header>

      <section className="mt-6 space-y-6" aria-label="Staff profile">
        <Card className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.75rem]">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full bg-[linear-gradient(135deg,#cc0000,#d4af37)] p-px">
                <ImageWithFallback
                  src={profile.photoUrl}
                  alt={
                    profile.photoAlt ?? `${profile.displayName} profile photo`
                  }
                  placeholderType="staff"
                  fill
                  className="rounded-full object-cover"
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

            <section className="mt-6" aria-label="Rate this staff member">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
                Your rating
              </h2>
              <StaffStarRating staffId={id} initialRating={userRating} />
            </section>

            <section className="mt-6" aria-label="Tip this staff member">
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
                Tip
              </h2>
              <TipButton staffId={id} />
            </section>

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
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
            Gallery
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((src, index) => (
              <Card
                key={`${String(src)}-${index}`}
                className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.25rem]"
              >
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
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-white">
            Reviews and comments
          </h2>

          {profile.ratings.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No reviews yet.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {profile.ratings.map((rating) => (
                <article key={rating.id} className="glass-card rounded-md p-4">
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

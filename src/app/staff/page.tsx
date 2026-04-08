import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { staffService } from "@/services/staffService";
import { Star } from "lucide-react";

export const revalidate = 3600;

type StaffPageProps = {
  searchParams?: Promise<{ bar?: string }>;
};

const formatAverageRating = (averageRating: number | null) => {
  if (averageRating === null) return "—";
  return averageRating.toFixed(1);
};

const StarRating = ({ rating }: { rating: number | null }) => {
  if (rating === null) {
    return <span className="text-xs text-muted-foreground">No ratings</span>;
  }

  const clamped = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={
            index < clamped
              ? "h-4 w-4 text-[#d4af37] fill-[#d4af37]"
              : "h-4 w-4 text-[#444]"
          }
        />
      ))}
      <span className="ml-1 text-xs font-medium text-[#d4af37]">
        {formatAverageRating(rating)}
      </span>
    </div>
  );
};

/**
 * Staff profiles listing page with an optional bar filter.
 */
export default async function StaffPage({ searchParams }: StaffPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const barFilter = resolvedSearchParams.bar?.trim() || undefined;

  const profiles = await staffService.listApprovedStaffProfiles(barFilter);

  return (
    <main className="ppbn-page mx-auto w-full max-w-7xl px-4 py-10 lg:px-8">
      <header className="ppbn-hero-frame space-y-4 rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-(--accent-gold)">
          People
        </p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Staff
        </h1>
      </header>

      <section className="mt-6" aria-label="Filters">
        <form role="search" className="flex flex-wrap items-end gap-3">
          <div className="w-full max-w-sm">
            <Label htmlFor="bar">Filter by bar</Label>
            <Input
              id="bar"
              name="bar"
              defaultValue={resolvedSearchParams.bar ?? ""}
              placeholder="e.g. Riverside"
              className="ppbn-input"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#cc0000] text-white hover:bg-[#ff0000] rounded-sm"
          >
            Filter
          </Button>
          <Button asChild variant="outline">
            <Link href="/staff">Clear</Link>
          </Button>
        </form>
      </section>

      {profiles.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No staff profiles found.
        </p>
      ) : (
        <section
          className="mt-6 space-y-4"
          aria-label="Approved staff profiles"
        >
          {profiles.map((profile) => (
            <article key={profile.id} className="rounded-md">
              <Card className="ppbn-card glass-card hover:glow-red transition-all rounded-[1.5rem]">
                <CardHeader>
                  <CardTitle className="font-display text-base text-white">
                    <Link
                      href={`/staff/${profile.id}`}
                      className="hover:text-(--accent-gold)"
                    >
                      {profile.displayName}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[linear-gradient(135deg,#cc0000,#d4af37)] p-[1px]">
                      <ImageWithFallback
                        src={profile.photoUrl}
                        alt={
                          profile.photoAlt ??
                          `${profile.displayName} profile photo`
                        }
                        placeholderType="staff"
                        fill
                        className="rounded-full object-cover"
                        sizes="64px"
                      />
                    </div>

                    <dl className="grid flex-1 grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">Role</dt>
                        <dd>{profile.position ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Bar</dt>
                        <dd>{profile.currentBar ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Rating</dt>
                        <dd>
                          <StarRating rating={profile.averageRating} />
                          <span className="text-muted-foreground">
                            {" "}
                            ({profile.ratingCount})
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

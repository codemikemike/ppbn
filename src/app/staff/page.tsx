import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { staffService } from "@/services/staffService";

export const revalidate = 3600;

type StaffPageProps = {
  searchParams?: Promise<{ bar?: string }>;
};

const formatAverageRating = (averageRating: number | null) => {
  if (averageRating === null) return "—";
  return averageRating.toFixed(1);
};

/**
 * Staff profiles listing page with an optional bar filter.
 */
export default async function StaffPage({ searchParams }: StaffPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const barFilter = resolvedSearchParams.bar?.trim() || undefined;

  const profiles = await staffService.listApprovedStaffProfiles(barFilter);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Staff</h1>

      <section className="mt-6" aria-label="Filters">
        <form role="search" className="flex flex-wrap items-end gap-3">
          <div className="w-full max-w-sm">
            <Label htmlFor="bar">Filter by bar</Label>
            <Input
              id="bar"
              name="bar"
              defaultValue={resolvedSearchParams.bar ?? ""}
              placeholder="e.g. Riverside"
            />
          </div>
          <Button type="submit">Filter</Button>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      href={`/staff/${profile.id}`}
                      className="hover:underline"
                    >
                      {profile.displayName}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                      <ImageWithFallback
                        src={profile.photoUrl}
                        alt={
                          profile.photoAlt ??
                          `${profile.displayName} profile photo`
                        }
                        placeholderType="staff"
                        fill
                        className="object-cover"
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
                          {formatAverageRating(profile.averageRating)}
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

import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { barService } from "@/services/barService";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

const removeFavorite = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const slug = formData.get("slug");
  if (typeof slug !== "string" || !slug.trim()) {
    return;
  }

  await barService.toggleFavorite(slug, session.user.id);
  revalidatePath("/dashboard/favorites");
};

/**
 * Favorites dashboard page.
 *
 * @returns The current user's favorite bars list.
 */
export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const favorites = await barService.getUserFavorites(session.user.id);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
        </CardHeader>
        <CardContent>
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You have no favorite bars yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {favorites.map((bar) => (
                <li
                  key={bar.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3"
                >
                  <Link
                    href={`/bars/${bar.slug}`}
                    className="text-sm font-medium hover:underline"
                  >
                    {bar.name}
                  </Link>

                  <form action={removeFavorite}>
                    <input type="hidden" name="slug" value={bar.slug} />
                    <Button type="submit" variant="outline" size="sm">
                      Remove
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

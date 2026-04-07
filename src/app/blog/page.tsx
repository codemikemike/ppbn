import Link from "next/link";

import { blogService } from "@/services/blogService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const revalidate = 3600;

type BlogPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

const DEFAULT_LIMIT = 10;

const parsePage = (value: string | undefined): number => {
  if (!value) return 1;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return parsed;
};

const buildBlogHref = (page: number) =>
  page <= 1 ? "/blog" : `/blog?page=${page}`;

const formatPublishedDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

/**
 * Blog listing page with pagination via the `page` query param.
 */
export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const page = parsePage(resolvedSearchParams.page);

  const posts = await blogService.listPublishedPosts(page, DEFAULT_LIMIT);

  const hasNextPage = posts.length === DEFAULT_LIMIT;
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = hasNextPage ? page + 1 : null;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Blog</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No posts published yet.
        </p>
      ) : (
        <section className="mt-6 space-y-4" aria-label="Published posts">
          {posts.map((post) => {
            const excerpt = post.excerpt?.trim()
              ? post.excerpt
              : `${post.content.slice(0, 180).trim()}...`;

            return (
              <article key={post.id} className="rounded-md">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:underline"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{excerpt}</p>

                    <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex gap-1">
                        <dt className="sr-only">Author</dt>
                        <dd>{post.authorName ?? "Anonymous"}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="sr-only">Published</dt>
                        <dd>{formatPublishedDate(post.publishedAt)}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt className="sr-only">Category</dt>
                        <dd>{post.category ?? "—"}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </article>
            );
          })}
        </section>
      )}

      <nav
        className="mt-8 flex items-center justify-between"
        aria-label="Pagination"
      >
        {previousPage ? (
          <Link
            href={buildBlogHref(previousPage)}
            className="text-sm text-muted-foreground hover:underline"
          >
            Previous
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">Previous</span>
        )}

        <span className="text-sm text-muted-foreground">Page {page}</span>

        {nextPage ? (
          <Link
            href={buildBlogHref(nextPage)}
            className="text-sm text-muted-foreground hover:underline"
          >
            Next
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">Next</span>
        )}
      </nav>
    </main>
  );
}

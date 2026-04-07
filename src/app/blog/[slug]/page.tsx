import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/shared/ImageWithFallback";
import { blogService } from "@/services/blogService";
import { NotFoundError } from "@/domain/errors/DomainErrors";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const formatPublishedDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

const buildMetadataDescription = (excerpt: string | null, content: string) => {
  const trimmedExcerpt = excerpt?.trim();
  if (trimmedExcerpt) return trimmedExcerpt;

  const trimmedContent = content.trim();
  if (!trimmedContent) return "";

  return trimmedContent.length > 160
    ? `${trimmedContent.slice(0, 157)}...`
    : trimmedContent;
};

/**
 * Generates SEO metadata for a published blog post.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await blogService.getPublishedPostBySlug(slug);

    return {
      title: post.title,
      description: buildMetadataDescription(post.excerpt, post.content),
    };
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}

/**
 * Blog post detail page.
 */
export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let post;
  try {
    post = await blogService.getPublishedPostBySlug(slug);
  } catch (err) {
    if (err instanceof NotFoundError) notFound();
    throw err;
  }

  const candidates = await blogService.listPublishedPosts(1, 50);
  const relatedPosts = post.category
    ? candidates
        .filter((candidate) => candidate.slug !== post.slug)
        .filter((candidate) => candidate.category === post.category)
        .slice(0, 3)
    : [];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <Link
          href="/blog"
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to Blog
        </Link>
      </div>

      <section
        className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"
        aria-label="Blog post"
      >
        <article className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="relative aspect-video w-full overflow-hidden rounded-md">
                <ImageWithFallback
                  src={post.imageUrl}
                  alt={`${post.title} cover image`}
                  placeholderType="blog"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 768px"
                  priority
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Post details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Author</dt>
                  <dd>{post.authorName ?? "Anonymous"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Published</dt>
                  <dd>{formatPublishedDate(post.publishedAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Category</dt>
                  <dd>{post.category ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Tags</dt>
                  <dd>
                    {post.tags.length === 0 ? (
                      "—"
                    ) : (
                      <ul className="flex flex-wrap gap-2" aria-label="Tags">
                        {post.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-md border px-2 py-1 text-xs text-muted-foreground"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-sm text-muted-foreground">
                {post.content}
              </div>
            </CardContent>
          </Card>
        </article>

        <aside className="space-y-4" aria-label="Related posts">
          <h2 className="text-sm font-medium">Related posts</h2>

          {relatedPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No related posts.</p>
          ) : (
            <div className="space-y-3">
              {relatedPosts.map((related) => (
                <Card key={related.id}>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      <Link
                        href={`/blog/${related.slug}`}
                        className="hover:underline"
                      >
                        {related.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      {formatPublishedDate(related.publishedAt)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

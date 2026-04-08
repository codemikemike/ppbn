import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

import { adminService } from "@/services/adminService";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

/**
 * Forces this page to be rendered dynamically per-request.
 */
export const dynamic = "force-dynamic";

const setPublish = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const postId = formData.get("postId");
  const published = formData.get("published");

  if (typeof postId !== "string" || !postId.trim()) return;
  if (published !== "true" && published !== "false") return;

  await adminService.setBlogPublish(session.user.id, postId, {
    published: published === "true",
  });

  revalidatePath("/admin/blog");
};

const deleteBlogPost = async (formData: FormData) => {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "Admin") {
    redirect("/");
  }

  const postId = formData.get("postId");
  if (typeof postId !== "string" || !postId.trim()) return;

  await adminService.deleteBlogPost(session.user.id, postId);
  revalidatePath("/admin/blog");
};

/**
 * Admin blog posts page.
 */
export default async function AdminBlogPage() {
  const posts = await adminService.listBlogPosts();

  return (
    <main className="ppbn-page space-y-6">
      <header className="ppbn-hero space-y-2">
        <p className="ppbn-kicker">Moderation</p>
        <h1 className="font-display text-gradient-red text-4xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
          Blog
        </h1>
        <p className="text-sm text-muted-foreground">
          Publish, unpublish, and delete blog posts.
        </p>
      </header>

      <Card className="glass-card glow-red border-none rounded-[1.75rem]">
        <CardHeader>
          <h2 className="font-display text-lg font-black uppercase tracking-[-0.06em] text-white">
            All blog posts
          </h2>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No blog posts found.
            </p>
          ) : (
            <ul className="space-y-3">
              {posts.map((post) => (
                <li key={post.id} className="glass-card rounded-2xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {post.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="font-medium text-(--accent-gold) hover:text-white"
                        >
                          /blog/{post.slug}
                        </Link>
                        {" · "}
                        {post.isPublished ? "Published" : "Draft"}
                        {post.deletedAt ? " · Deleted" : ""}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <form action={setPublish}>
                        <input type="hidden" name="postId" value={post.id} />
                        <input
                          type="hidden"
                          name="published"
                          value={post.isPublished ? "false" : "true"}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          className="rounded-sm border border-[rgba(255,255,255,0.14)] bg-transparent text-white hover:bg-[rgba(204,0,0,0.2)] hover:text-white"
                        >
                          {post.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                      </form>

                      <form action={deleteBlogPost}>
                        <input type="hidden" name="postId" value={post.id} />
                        <Button type="submit" size="sm" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

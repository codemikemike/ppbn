import { db } from "@/lib/db";
import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";
import type {
  IBlogRepository,
  PublishedBlogPostFilters,
} from "@/domain/interfaces/IBlogRepository";
import type { BlogPost } from "@/generated/prisma";

const toBlogPostDto = (
  post: BlogPost & {
    author: {
      name: string | null;
    };
  },
): BlogPostDto => {
  if (!post.publishedAt) {
    throw new Error(
      "Invariant violation: published post must have publishedAt",
    );
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    authorName: post.author.name,
    publishedAt: post.publishedAt,
    category: post.tags ?? null,
    imageUrl: post.coverImageUrl ?? null,
  };
};

/**
 * Blog repository backed by Prisma.
 */
export const blogRepository: IBlogRepository = {
  /**
   * Lists published posts for a page.
   * @param filters Pagination filters.
   */
  async findAllPublished(
    filters: PublishedBlogPostFilters,
  ): Promise<BlogPostDto[]> {
    const skip = (filters.page - 1) * filters.limit;

    const posts = await db.blogPost.findMany({
      where: {
        isPublished: true,
        publishedAt: {
          not: null,
        },
        deletedAt: null,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }],
      skip,
      take: filters.limit,
    });

    return posts.map((post) => toBlogPostDto(post));
  },
};

import { db } from "@/lib/db";
import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";
import type { CommentDto } from "@/domain/dtos/CommentDto";
import type {
  IBlogRepository,
  PublishedBlogPostFilters,
} from "@/domain/interfaces/IBlogRepository";
import type { BlogPost } from "@/generated/prisma";

const parseTags = (rawTags: string | null): string[] => {
  if (!rawTags) return [];

  return rawTags
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

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

  const tags = parseTags(post.tags ?? null);
  const category = tags.length > 0 ? tags[0] : null;

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    authorName: post.author.name,
    publishedAt: post.publishedAt,
    category,
    tags,
    imageUrl: post.coverImageUrl ?? null,
  };
};

const toCommentDto = (comment: {
  id: string;
  content: string;
  createdAt: Date;
  user: { name: string | null };
}): CommentDto => {
  return {
    id: comment.id,
    content: comment.content,
    authorName: comment.user.name,
    createdAt: comment.createdAt,
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

  /**
   * Finds a published post by slug.
   * @param slug Post slug.
   */
  async findBySlug(slug: string): Promise<BlogPostDto | null> {
    const post = await db.blogPost.findFirst({
      where: {
        slug,
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
    });

    if (!post) return null;

    return toBlogPostDto(post);
  },

  /**
   * Lists approved comments for a published blog post.
   * @param slug Post slug.
   */
  async findCommentsBySlug(slug: string): Promise<CommentDto[]> {
    const comments = await db.blogComment.findMany({
      where: {
        blogPost: {
          slug,
          isPublished: true,
          publishedAt: {
            not: null,
          },
          deletedAt: null,
        },
        isApproved: true,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return comments.map((comment) => toCommentDto(comment));
  },

  /**
   * Creates a blog comment for a published blog post.
   * @param slug Post slug.
   * @param userId User id.
   * @param content Comment content.
   */
  async createComment(
    slug: string,
    userId: string,
    content: string,
  ): Promise<CommentDto> {
    const post = await db.blogPost.findFirst({
      where: {
        slug,
        isPublished: true,
        publishedAt: {
          not: null,
        },
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      throw new Error("Invariant violation: blog post not found for slug");
    }

    const comment = await db.blogComment.create({
      data: {
        blogPostId: post.id,
        userId,
        content,
        isApproved: false,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return toCommentDto(comment);
  },
};

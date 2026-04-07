import { beforeAll, describe, expect, it, vi } from "vitest";

import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";
import { NotFoundError } from "@/domain/errors/DomainErrors";

const findAllPublishedMock = vi.fn();
const findBySlugMock = vi.fn();

vi.mock("@/repositories/blogRepository", () => {
  return {
    blogRepository: {
      findAllPublished: findAllPublishedMock,
      findBySlug: findBySlugMock,
    },
  };
});

let blogService: typeof import("../blogService").blogService;

beforeAll(async () => {
  ({ blogService } = await import("../blogService"));
});

describe("blogService.listPublishedPosts", () => {
  it("returns posts", async () => {
    const publishedAt = new Date("2026-04-07T12:00:00.000Z");

    const posts: BlogPostDto[] = [
      {
        id: "post_1",
        slug: "hello-pp",
        title: "Hello Phnom Penh",
        excerpt: "A quick intro",
        content: "Full content",
        authorName: "Mike",
        publishedAt,
        category: "Nightlife",
        tags: ["Nightlife"],
        imageUrl: null,
      },
    ];

    findAllPublishedMock.mockResolvedValueOnce(posts);

    const result = await blogService.listPublishedPosts(1, 10);

    expect(result).toEqual(posts);
    expect(findAllPublishedMock).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});

describe("blogService.getPublishedPostBySlug", () => {
  it("returns a post when slug exists", async () => {
    const publishedAt = new Date("2026-04-07T12:00:00.000Z");

    const post: BlogPostDto = {
      id: "post_1",
      slug: "hello-pp",
      title: "Hello Phnom Penh",
      excerpt: "A quick intro",
      content: "Full content",
      authorName: "Mike",
      publishedAt,
      category: "Nightlife",
      tags: ["Nightlife", "Phnom Penh"],
      imageUrl: null,
    };

    findBySlugMock.mockResolvedValueOnce(post);

    await expect(
      blogService.getPublishedPostBySlug("hello-pp"),
    ).resolves.toEqual(post);
  });

  it("throws NotFoundError when slug is missing", async () => {
    findBySlugMock.mockResolvedValueOnce(null);

    await expect(
      blogService.getPublishedPostBySlug("missing"),
    ).rejects.toBeInstanceOf(NotFoundError);
  });
});

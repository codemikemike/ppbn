import { beforeAll, describe, expect, it, vi } from "vitest";

import type { BlogPostDto } from "@/domain/dtos/BlogPostDto";

const findAllPublishedMock = vi.fn();

vi.mock("@/repositories/blogRepository", () => {
  return {
    blogRepository: {
      findAllPublished: findAllPublishedMock,
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
        imageUrl: null,
      },
    ];

    findAllPublishedMock.mockResolvedValueOnce(posts);

    const result = await blogService.listPublishedPosts(1, 10);

    expect(result).toEqual(posts);
    expect(findAllPublishedMock).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });
});

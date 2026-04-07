import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => {
  return {
    db: {
      bar: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
  };
});

type FindFirstMock = ReturnType<typeof vi.fn>;

const getFindFirstMock = async (): Promise<FindFirstMock> => {
  const { db } = await import("@/lib/db");
  return db.bar.findFirst as unknown as FindFirstMock;
};

let barRepository: typeof import("../barRepository").barRepository;

beforeAll(async () => {
  ({ barRepository } = await import("../barRepository"));
});

describe("barRepository.findBySlug", () => {
  it("returns bar with mapped reviews", async () => {
    const findFirst = await getFindFirstMock();

    const now = new Date("2026-04-07T12:00:00.000Z");

    findFirst.mockResolvedValue({
      id: "bar_1",
      slug: "rose-bar",
      name: "Rose Bar",
      description: "Great cocktails.",
      area: "BKK1",
      category: "CocktailBar",
      openingHours: "18:00-02:00",
      isFeatured: false,
      isApproved: true,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      images: [],
      reviews: [
        {
          id: "rev_1",
          rating: 5,
          title: null,
          content: "Amazing.",
          createdAt: now,
          user: { id: "user_1", name: "Alice" },
        },
      ],
    });

    const bar = await barRepository.findBySlug("rose-bar");

    expect(bar).not.toBeNull();
    expect(bar?.slug).toBe("rose-bar");
    expect(bar?.reviews).toHaveLength(1);
    expect(bar?.reviews[0]).toMatchObject({
      id: "rev_1",
      rating: 5,
      content: "Amazing.",
      user: { id: "user_1", name: "Alice" },
    });
  });

  it("returns null for unknown slug", async () => {
    const findFirst = await getFindFirstMock();
    findFirst.mockResolvedValue(null);

    const bar = await barRepository.findBySlug("unknown");
    expect(bar).toBeNull();
  });
});

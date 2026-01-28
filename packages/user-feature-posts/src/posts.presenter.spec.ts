import { describe, expect, it } from "vitest";

import {
  filterPosts,
  getAvailableTags,
  getAvailableYears,
  paginatePosts,
  type PostSummary,
} from "./posts.presenter";

const basePosts: PostSummary[] = [
  {
    publishedAt: "2026-01-12",
    slug: "a",
    summary: "Summary A",
    tags: ["Next.js"],
    title: "A",
  },
  {
    publishedAt: "2025-12-01",
    slug: "b",
    summary: "Summary B",
    tags: ["TypeScript", "Next.js"],
    title: "B",
  },
  {
    publishedAt: "2025-11-01",
    slug: "c",
    summary: "Summary C",
    tags: [],
    title: "C",
  },
  {
    publishedAt: "2025-10-01",
    slug: "d",
    summary: "Summary D",
    tags: ["TypeScript"],
    title: "D",
  },
  {
    publishedAt: "2025-09-01",
    slug: "e",
    summary: "Summary E",
    tags: ["Chakra"],
    title: "E",
  },
  {
    publishedAt: "2025-08-01",
    slug: "f",
    summary: "Summary F",
    tags: ["Chakra"],
    title: "F",
  },
];

const paginationPosts: PostSummary[] = Array.from(
  { length: 11 },
  (_, index) => {
    const day = String(index + 1).padStart(2, "0");
    return {
      publishedAt: `2025-01-${day}`,
      slug: `post-${index + 1}`,
      summary: `Summary ${index + 1}`,
      tags: [],
      title: `Title ${index + 1}`,
    };
  },
);

describe("posts presenter", () => {
  it("getAvailableYears returns unique years desc", () => {
    expect(getAvailableYears(basePosts)).toEqual(["2026", "2025"]);
  });

  it("getAvailableTags returns unique tags", () => {
    expect(getAvailableTags(basePosts)).toEqual([
      "Chakra",
      "Next.js",
      "TypeScript",
    ]);
  });

  it("filterPosts filters by year", () => {
    expect(
      filterPosts(basePosts, { tag: null, year: "2026" }).map((p) => p.slug),
    ).toEqual(["a"]);
  });

  it("filterPosts filters by tag", () => {
    expect(
      filterPosts(basePosts, { tag: "Chakra", year: null }).map((p) => p.slug),
    ).toEqual(["e", "f"]);
  });

  it("paginatePosts uses page size 10", () => {
    const page1 = paginatePosts(paginationPosts, 1);

    expect(page1.totalPages).toBe(2);
    expect(page1.items).toHaveLength(10);
  });

  it("paginatePosts returns remaining items on the last page", () => {
    const page2 = paginatePosts(paginationPosts, 2);

    expect(page2.items).toHaveLength(1);
  });
});

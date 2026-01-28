import { describe, expect, it, vi } from "vitest";

vi.mock("./posts", () => ({
  getPostFrontmatter: vi.fn(),
  getPostSlugs: vi.fn(),
}));

import { getPostList } from "./get-post-list";
import { getPostSlugs } from "./posts";

describe("getPostList", () => {
  it("returns post summaries using frontmatter values", async () => {
    const mockedGetPostSlugs = vi.mocked(getPostSlugs);
    const loader = vi.fn();

    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2026-01-02", slug: "second" },
      { publishedAt: "2026-01-01", slug: "first" },
    ]);
    loader
      .mockResolvedValueOnce({
        summary: "2つ目の要約",
        tags: ["b", "c"],
        title: "2つ目のタイトル",
      })
      .mockResolvedValueOnce({
        summary: "1つ目の要約",
        tags: ["a"],
        title: "1つ目のタイトル",
      });

    const posts = await getPostList(loader);

    expect(posts).toEqual([
      {
        publishedAt: "2026-01-02",
        slug: "second",
        summary: "2つ目の要約",
        tags: ["b", "c"],
        title: "2つ目のタイトル",
      },
      {
        publishedAt: "2026-01-01",
        slug: "first",
        summary: "1つ目の要約",
        tags: ["a"],
        title: "1つ目のタイトル",
      },
    ]);
    expect(mockedGetPostSlugs).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenNthCalledWith(1, "second");
    expect(loader).toHaveBeenNthCalledWith(2, "first");
  });

  it("falls back to slug and empty values when frontmatter is missing", async () => {
    const mockedGetPostSlugs = vi.mocked(getPostSlugs);
    const loader = vi.fn();

    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2026-01-03", slug: "no-frontmatter" },
    ]);
    loader.mockResolvedValueOnce({});

    const posts = await getPostList(loader);

    expect(posts).toEqual([
      {
        publishedAt: "2026-01-03",
        slug: "no-frontmatter",
        summary: "",
        tags: [],
        title: "no-frontmatter",
      },
    ]);
  });

  it("filters out non-string tags from frontmatter", async () => {
    const mockedGetPostSlugs = vi.mocked(getPostSlugs);
    const loader = vi.fn();

    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2026-01-04", slug: "tag-filter" },
    ]);
    loader.mockResolvedValueOnce({
      tags: ["ok", 123, null],
      title: "タグのテスト",
    });

    const posts = await getPostList(loader);

    expect(posts[0]?.tags).toEqual(["ok"]);
  });
});

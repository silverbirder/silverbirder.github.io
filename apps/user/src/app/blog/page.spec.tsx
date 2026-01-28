import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/util", async () => {
  const actual =
    await vi.importActual<typeof import("@repo/util")>("@repo/util");
  return {
    ...actual,
    buildSiteUrl: vi.fn((pathname: string) => `url:${pathname}`),
  };
});

vi.mock("@/libs/posts/posts", () => ({
  getPostFrontmatter: vi.fn(),
  getPostSlugs: vi.fn(),
}));

vi.mock("@/libs", async () => {
  const actual = await vi.importActual<
    typeof import("@/libs/posts/get-post-list")
  >("@/libs/posts/get-post-list");
  return {
    getPostList: actual.getPostList,
  };
});

import { getPostList } from "@/libs/posts/get-post-list";
import { getPostSlugs } from "@/libs/posts/posts";

import { metadata } from "./page";

describe("getPostList", () => {
  it("returns titles with publishedAt in the slug order", async () => {
    const mockedGetPostSlugs = vi.mocked(getPostSlugs);
    const loader = vi.fn();

    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2020-01-01", slug: "first" },
      { publishedAt: "2021-01-01", slug: "second" },
    ]);
    loader
      .mockResolvedValueOnce({
        publishedAt: "2020-01-01",
        title: "Old title",
      })
      .mockResolvedValueOnce({
        publishedAt: "2021-01-01",
        title: "New title",
      });

    const posts = await getPostList(loader);

    expect(posts).toEqual([
      {
        publishedAt: "2020-01-01",
        slug: "first",
        summary: "",
        tags: [],
        title: "Old title",
      },
      {
        publishedAt: "2021-01-01",
        slug: "second",
        summary: "",
        tags: [],
        title: "New title",
      },
    ]);
    expect(mockedGetPostSlugs).toHaveBeenCalledTimes(1);
    expect(loader).toHaveBeenNthCalledWith(1, "first");
    expect(loader).toHaveBeenNthCalledWith(2, "second");
  });
});

describe("metadata", () => {
  it("defines metadata for the blog index page", () => {
    expect(metadata.title).toBe("ブログ");
    expect(metadata.alternates?.canonical).toBe("url:blog/");
    expect(metadata.openGraph).toMatchObject({
      title: "ブログ",
      type: "website",
      url: "url:blog/",
    });
    expect(metadata.twitter).toMatchObject({
      title: "ブログ",
    });
  });
});

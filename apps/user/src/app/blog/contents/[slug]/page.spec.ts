import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/util", async () => {
  const actual =
    await vi.importActual<typeof import("@repo/util")>("@repo/util");
  return {
    ...actual,
    buildSiteUrl: vi.fn((pathname: string) => `url:${pathname}`),
  };
});

vi.mock("@repo/user-feature-posts", () => ({
  normalizePosts: vi.fn((posts) => posts),
}));

vi.mock("@repo/user-feature-post-article", () => ({
  PostArticle: () => null,
}));

vi.mock("@/libs", async () => {
  const actual = await vi.importActual<typeof import("@/libs")>("@/libs");
  return {
    ...actual,
    getPostFrontmatter: vi.fn(),
    getPostSlugs: vi.fn(),
  };
});

import { getPostFrontmatter, getPostSlugs } from "@/libs";

import { generateMetadata } from "./page";
import { generateStaticParams } from "./static-params";

describe("generateStaticParams", () => {
  it("returns params for each slug", async () => {
    const mockedGetPostSlugs = vi.mocked(getPostSlugs);

    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2025-10-27", slug: "20251027" },
      { publishedAt: "2025-11-01", slug: "20251101" },
    ]);

    const params = await generateStaticParams();

    expect(params).toEqual([{ slug: "20251027" }, { slug: "20251101" }]);
    expect(mockedGetPostSlugs).toHaveBeenCalledTimes(1);
  });
});

describe("generateMetadata", () => {
  it("builds metadata from the post frontmatter", async () => {
    const mockedGetPostFrontmatter = vi.mocked(getPostFrontmatter);

    mockedGetPostFrontmatter.mockResolvedValue({
      index: false,
      publishedAt: "2025-10-27",
      summary: "要約テキスト",
      tags: ["TagA", "TagB"],
      title: "記事タイトル",
    });

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "20251027" }),
    } as Parameters<typeof generateMetadata>[0]);

    expect(mockedGetPostFrontmatter).toHaveBeenCalledWith("20251027");
    expect(metadata.title).toBe("記事タイトル");
    expect(metadata.description).toBe("要約テキスト");
    expect(metadata.alternates?.canonical).toBe("url:blog/contents/20251027/");
    expect(metadata.keywords).toEqual(["TagA", "TagB"]);
    expect(metadata.openGraph).toMatchObject({
      title: "記事タイトル",
      type: "article",
      url: "url:blog/contents/20251027/",
    });
    expect(metadata.twitter).toMatchObject({
      title: "記事タイトル",
    });
    expect(metadata.robots).toEqual({ index: false });
  });
});

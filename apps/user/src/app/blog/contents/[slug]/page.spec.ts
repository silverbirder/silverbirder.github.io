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

import { buildBlogPostingJsonLd, generateMetadata } from "./page";
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
    expect(metadata.robots).toEqual({
      googleBot: {
        follow: true,
        index: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      index: false,
    });
  });
});

describe("buildBlogPostingJsonLd", () => {
  it("builds BlogPosting structured data for the article page", () => {
    const result = buildBlogPostingJsonLd({
      canonical: "url:blog/contents/20251027/",
      description: "要約テキスト",
      imageUrl: "url:blog/contents/20251027/opengraph-image.png",
      publishedAt: "2025-10-27",
      tags: ["TagA", "TagB"],
      title: "記事タイトル",
    });

    expect(result).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      author: {
        "@type": "Person",
        name: "silverbirder",
      },
      datePublished: "2025-10-27",
      description: "要約テキスト",
      headline: "記事タイトル",
      image: ["url:blog/contents/20251027/opengraph-image.png"],
      keywords: ["TagA", "TagB"],
      mainEntityOfPage: {
        "@id": "url:blog/contents/20251027/",
        "@type": "WebPage",
      },
      publisher: {
        "@type": "Organization",
        logo: {
          "@type": "ImageObject",
          url: "url:assets/logo.png",
        },
        name: "ジブンノート",
      },
      url: "url:blog/contents/20251027/",
    });
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import { getPostSlugs } from "@/libs";

import sitemap from "./sitemap";

vi.mock("@/libs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/libs")>();
  return {
    ...actual,
    getPostSlugs: vi.fn(),
  };
});

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const originalBasePath = process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH;

const restoreEnv = () => {
  if (originalSiteUrl === undefined) {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  } else {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  }

  if (originalBasePath === undefined) {
    delete process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH;
  } else {
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = originalBasePath;
  }
};

afterEach(() => {
  restoreEnv();
  vi.clearAllMocks();
});

describe("sitemap", () => {
  it("returns urls with the base path applied", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "/docs";

    const mockedGetPostSlugs = vi.mocked(getPostSlugs);
    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2025-01-01", slug: "second-post" },
      { publishedAt: "2024-01-01", slug: "first-post" },
    ]);

    const entries = await sitemap();

    expect(entries).toEqual([
      { url: "https://example.com/docs/" },
      { url: "https://example.com/docs/me/" },
      { url: "https://example.com/docs/blog/" },
      { url: "https://example.com/docs/blog/contents/second-post/" },
      { url: "https://example.com/docs/blog/contents/first-post/" },
    ]);
    expect(mockedGetPostSlugs).toHaveBeenCalledTimes(1);
  });
});

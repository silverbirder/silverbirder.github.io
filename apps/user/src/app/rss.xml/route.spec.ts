import { afterEach, describe, expect, it, vi } from "vitest";

import { getPostSlugs } from "@/libs";

import { buildRssXml, getRssItems } from "./route";

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

describe("getRssItems", () => {
  it("returns items with title and summary from frontmatter", async () => {
    const mockedGetPostSlugs = vi.mocked(getPostSlugs);
    mockedGetPostSlugs.mockResolvedValue([
      { publishedAt: "2024-01-01", slug: "first-post" },
    ]);

    const loader = vi.fn().mockResolvedValue({
      summary: "First summary",
      title: "First title",
    });

    const items = await getRssItems(loader);

    expect(items).toEqual([
      {
        publishedAt: "2024-01-01",
        slug: "first-post",
        summary: "First summary",
        title: "First title",
      },
    ]);
    expect(loader).toHaveBeenCalledWith("first-post");
    expect(mockedGetPostSlugs).toHaveBeenCalledTimes(1);
  });
});

describe("buildRssXml", () => {
  it("renders urls with base path and escapes special characters", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "/docs";

    const xml = buildRssXml([
      {
        publishedAt: "2024-02-03",
        slug: "hello-world",
        summary: 'Fish & Chips <tasty> "yes"',
        title: "Hello & World",
      },
    ]);

    expect(xml).toContain("<link>https://example.com/docs/blog/</link>");
    expect(xml).toContain("https://example.com/docs/rss.xml");
    expect(xml).toContain(
      "<link>https://example.com/docs/blog/contents/hello-world/</link>",
    );
    expect(xml).toContain("<title><![CDATA[Hello & World]]></title>");
    expect(xml).toContain(
      '<description><![CDATA[Fish & Chips <tasty> "yes"]]></description>',
    );
  });
});

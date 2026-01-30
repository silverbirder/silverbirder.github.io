import { Top } from "@repo/user-feature-top";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/util", async () => {
  const actual =
    await vi.importActual<typeof import("@repo/util")>("@repo/util");
  return {
    ...actual,
    buildSiteUrl: vi.fn((pathname: string) => `url:${pathname}`),
  };
});

vi.mock("@/libs", () => ({
  getPostList: vi.fn().mockResolvedValue([]),
  getTimelineList: vi.fn().mockResolvedValue([]),
}));

import Page, { buildBlogSummary, metadata } from "./page";

describe("Page", () => {
  it("builds blog summary with consecutive day count", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-05T03:00:00Z"));
    const posts = [
      { publishedAt: "2026-01-05" },
      { publishedAt: "2026-01-05" },
      { publishedAt: "2026-01-04" },
      { publishedAt: "2026-01-03" },
      { publishedAt: "2026-01-01" },
    ];

    const summary = buildBlogSummary(posts);

    expect(summary).toEqual({
      latestPublishedAt: "2026-01-05",
      streakDays: 3,
      totalCount: 5,
    });
    vi.useRealTimers();
  });

  it("counts streak from yesterday when there is no post today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-05T03:00:00Z"));
    const posts = [
      { publishedAt: "2026-01-04" },
      { publishedAt: "2026-01-03" },
      { publishedAt: "2026-01-01" },
    ];

    const summary = buildBlogSummary(posts);

    expect(summary).toEqual({
      latestPublishedAt: "2026-01-04",
      streakDays: 2,
      totalCount: 3,
    });
    vi.useRealTimers();
  });

  it("uses the latest post date when it is later than today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-30T03:00:00Z"));
    const posts = [
      { publishedAt: "2026-01-31" },
      { publishedAt: "2026-01-29" },
    ];

    const summary = buildBlogSummary(posts);

    expect(summary).toEqual({
      latestPublishedAt: "2026-01-31",
      streakDays: 1,
      totalCount: 2,
    });
    vi.useRealTimers();
  });

  it("renders the top feature entry", async () => {
    const element = await Page();

    expect(isValidElement(element)).toBe(true);
    expect(element.type).toBe(Top);
  });

  it("defines metadata for the top page", () => {
    expect(metadata.description).toBe(
      "silverbirder のホームページ。ブログ記事や自己紹介などを掲載しています。",
    );
    expect(metadata.alternates?.canonical).toBe("url:");
    expect(metadata.openGraph).toMatchObject({
      title: "ジブンノート",
      type: "website",
      url: "url:",
    });
    expect(metadata.twitter).toMatchObject({
      title: "ジブンノート",
    });
  });
});

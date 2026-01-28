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

import Page, { metadata } from "./page";

describe("Page", () => {
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

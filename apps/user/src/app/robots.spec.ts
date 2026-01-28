import { afterEach, describe, expect, it } from "vitest";

import robots from "./robots";

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
});

describe("robots", () => {
  it("returns host and sitemap url using the base path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "/docs";

    const result = robots();

    expect(result).toEqual({
      host: "https://example.com",
      rules: {
        allow: "/",
        userAgent: "*",
      },
      sitemap: "https://example.com/docs/sitemap.xml",
    });
  });
});

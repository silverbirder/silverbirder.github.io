import { afterEach, describe, expect, it } from "vitest";

import { buildSitePath, buildSiteUrl, getSiteMetadataBase } from "./site";

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

describe("getSiteMetadataBase", () => {
  it("uses the default site url when env is not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH;

    const metadataBase = getSiteMetadataBase();

    expect(metadataBase.toString()).toBe("https://silverbirder.github.io/");
  });

  it("combines site url and base path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "docs";

    const metadataBase = getSiteMetadataBase();

    expect(metadataBase.toString()).toBe("https://example.com/docs/");
  });
});

describe("buildSiteUrl", () => {
  it("builds an absolute url with base path", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "/docs";

    const url = buildSiteUrl("sitemap.xml");

    expect(url).toBe("https://example.com/docs/sitemap.xml");
  });
});

describe("buildSitePath", () => {
  it("builds a scoped path for basePath", () => {
    process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH = "/docs";

    const path = buildSitePath("/");

    expect(path).toBe("/docs/");
  });
});

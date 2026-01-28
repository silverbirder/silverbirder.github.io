import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/util", () => ({
  buildSitePath: vi.fn((pathname: string) => `path:${pathname}`),
  buildSiteUrl: vi.fn((pathname: string) => `url:${pathname}`),
  getSiteMetadataBase: vi.fn(() => new URL("https://example.com/base/")),
}));

import { buildSitePath, buildSiteUrl, getSiteMetadataBase } from "@repo/util";

import {
  createSiteManifest,
  createSiteMetadata,
  iconSizes,
  siteBackgroundColor,
  siteDescription,
  siteName,
  siteShortName,
  siteThemeColor,
} from "./index";

afterEach(() => {
  vi.clearAllMocks();
});

describe("createSiteMetadata", () => {
  it("builds site metadata using the shared site helpers", () => {
    const result = createSiteMetadata();

    expect(result.alternates?.canonical).toBe("url:");
    const icons = result.icons;
    if (
      !icons ||
      typeof icons === "string" ||
      Array.isArray(icons) ||
      icons instanceof URL
    ) {
      throw new Error("Expected icon entries to be an object");
    }
    expect(icons.apple).toEqual([{ url: "path:apple-icon" }]);
    if (!Array.isArray(icons.icon)) {
      throw new Error("Expected icon entries to be an array");
    }
    const iconEntries = icons.icon;
    expect(iconEntries).toHaveLength(iconSizes.length);
    expect(iconEntries[0]).toEqual({
      sizes: "32x32",
      url: "path:icon/32",
    });
    expect(iconEntries[iconEntries.length - 1]).toEqual({
      sizes: "512x512",
      url: "path:icon/512",
    });
    expect(result.metadataBase?.toString()).toBe("https://example.com/base/");
    expect(result.openGraph?.images).toEqual([
      {
        alt: siteName,
        height: 630,
        url: "url:opengraph-image",
        width: 1200,
      },
    ]);
    expect(result.twitter?.images).toEqual(["url:opengraph-image"]);
    expect(buildSitePath).toHaveBeenCalledWith("apple-icon");
    expect(buildSiteUrl).toHaveBeenCalledWith("");
    expect(getSiteMetadataBase).toHaveBeenCalledTimes(1);
  });
});

describe("createSiteManifest", () => {
  it("builds the manifest payload with theme colors and icons", () => {
    const result = createSiteManifest();

    expect(result.background_color).toBe(siteBackgroundColor);
    expect(result.description).toBe(siteDescription);
    expect(result.name).toBe(siteName);
    expect(result.short_name).toBe(siteShortName);
    expect(result.start_url).toBe("path:/");
    expect(result.scope).toBe("path:/");
    expect(result.theme_color).toBe(siteThemeColor);
    if (!result.icons) {
      throw new Error("Expected manifest icons to be defined");
    }
    expect(result.icons).toHaveLength(iconSizes.length);
    expect(result.icons[0]).toEqual({
      sizes: "32x32",
      src: "path:icon/32",
      type: "image/png",
    });
    expect(result.icons[result.icons.length - 1]).toEqual({
      sizes: "512x512",
      src: "path:icon/512",
      type: "image/png",
    });
    expect(buildSitePath).toHaveBeenCalledWith("/");
  });
});

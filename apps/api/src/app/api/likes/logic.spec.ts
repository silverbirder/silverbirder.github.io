import { describe, expect, it } from "vitest";

import { buildCorsHeaders, normalizeSlug } from "./logic";

describe("normalizeSlug", () => {
  it("trims and lowercases", () => {
    expect(normalizeSlug("  Foo/Bar ")).toBe("foo/bar");
  });
});

describe("buildCorsHeaders", () => {
  it("returns empty origin when disallowed", () => {
    process.env.ALLOWED_ORIGINS = "https://allowed.example.com";
    const headers = buildCorsHeaders("https://blocked.example.com");
    expect(headers["Access-Control-Allow-Origin"]).toBe("");
  });
});

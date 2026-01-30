import { describe, expect, it } from "vitest";

import { buildSearchIndex, searchIndex } from "./search";

describe("searchIndex", () => {
  it("orders matches by latest published date", () => {
    const documents = buildSearchIndex([
      {
        body: "body includes next",
        publishedAt: "2025-01-01",
        slug: "body-only",
        title: "no match",
      },
      {
        body: "content",
        publishedAt: "2025-01-02",
        slug: "title-match",
        title: "next title",
      },
    ]);

    const result = searchIndex(documents, "next");

    expect(result.map((item) => item.slug)).toEqual([
      "title-match",
      "body-only",
    ]);
  });

  it("matches case-insensitively and trims input", () => {
    const documents = buildSearchIndex([
      {
        body: "react",
        publishedAt: "2025-01-01",
        slug: "lower",
        title: "React Hooks",
      },
    ]);

    const result = searchIndex(documents, "  REACT ");

    expect(result).toEqual([
      {
        publishedAt: "2025-01-01",
        slug: "lower",
        title: "React Hooks",
      },
    ]);
  });

  it("returns newer posts first even when only the body matches", () => {
    const documents = buildSearchIndex([
      {
        body: "query",
        publishedAt: "2025-01-01",
        slug: "older-title-match",
        title: "Query",
      },
      {
        body: "query",
        publishedAt: "2025-02-01",
        slug: "newer-body-match",
        title: "no match",
      },
    ]);

    const result = searchIndex(documents, "query");

    expect(result.map((item) => item.slug)).toEqual([
      "newer-body-match",
      "older-title-match",
    ]);
  });

  it("limits the number of results", () => {
    const documents = buildSearchIndex([
      {
        body: "aaa",
        publishedAt: "2025-01-01",
        slug: "first",
        title: "alpha",
      },
      {
        body: "aaa",
        publishedAt: "2025-01-02",
        slug: "second",
        title: "beta",
      },
      {
        body: "aaa",
        publishedAt: "2025-01-03",
        slug: "third",
        title: "gamma",
      },
    ]);

    const result = searchIndex(documents, "aaa", 2);

    expect(result).toHaveLength(2);
  });
});

import { describe, expect, it } from "vitest";

import {
  buildCorsHeaders,
  COMMENT_MAX_LENGTH,
  hashAnonId,
  parseCreateCommentBody,
  parseDeleteCommentBody,
} from "./logic";

describe("hashAnonId", () => {
  it("returns stable sha256 hash", () => {
    expect(hashAnonId("anon-user-1")).toBe(
      "98b9ee801b9b927fa15881fec2a963ba2d1e244248ce04dfb4d080c604ea7aaa",
    );
  });
});

describe("parseCreateCommentBody", () => {
  it("parses valid request", () => {
    const result = parseCreateCommentBody({
      anonId: "  user-1 ",
      body: " hello ",
      slug: "  Foo/Bar ",
    });
    if ("error" in result) {
      throw new Error(result.error);
    }

    expect(result.data).toEqual({
      anonId: "  user-1 ",
      body: " hello ",
      slug: "  foo/bar ",
    });
  });

  it("rejects too long body", () => {
    const result = parseCreateCommentBody({
      anonId: "user-1",
      body: "a".repeat(COMMENT_MAX_LENGTH + 1),
      slug: "slug",
    });

    expect(result).toEqual({
      error: `body must be at most ${COMMENT_MAX_LENGTH} characters`,
    });
  });
});

describe("parseDeleteCommentBody", () => {
  it("accepts numeric string comment id", () => {
    const result = parseDeleteCommentBody({
      anonId: " user-1 ",
      commentId: "10",
    });
    if ("error" in result) {
      throw new Error(result.error);
    }

    expect(result.data).toEqual({ anonId: " user-1 ", commentId: 10 });
  });

  it("rejects missing comment id", () => {
    const result = parseDeleteCommentBody({ anonId: "user-1" });
    expect(result).toEqual({ error: "anonId and commentId are required" });
  });
});

describe("buildCorsHeaders", () => {
  it("allows delete method", () => {
    process.env.ALLOWED_ORIGINS = "";
    const headers = buildCorsHeaders("https://example.com");
    expect(headers["Access-Control-Allow-Methods"]).toBe(
      "GET,POST,DELETE,OPTIONS",
    );
  });
});

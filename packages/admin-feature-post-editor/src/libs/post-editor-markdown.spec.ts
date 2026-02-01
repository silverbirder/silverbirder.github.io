import { describe, expect, it } from "vitest";

import { buildMarkdown, getUniqueDailyFileName } from "./post-editor-markdown";

describe("getUniqueDailyFileName", () => {
  it("returns the base name when not taken", () => {
    // Arrange
    const existing = ["20260131.md", "20260130.md"];
    const date = new Date("2026-02-01T12:00:00Z");

    // Act
    const result = getUniqueDailyFileName(existing, date);

    // Assert
    expect(result).toBe("20260201.md");
  });

  it("returns incremented name when the base is taken", () => {
    // Arrange
    const existing = ["20260201.md", "20260201-2.md", "20260201-3.md"];
    const date = new Date("2026-02-01T00:00:00Z");

    // Act
    const result = getUniqueDailyFileName(existing, date);

    // Assert
    expect(result).toBe("20260201-4.md");
  });

  it("ignores case when checking existing names", () => {
    // Arrange
    const existing = ["20260201.MD"];
    const date = new Date("2026-02-01T00:00:00Z");

    // Act
    const result = getUniqueDailyFileName(existing, date);

    // Assert
    expect(result).toBe("20260201-2.md");
  });
});

describe("buildMarkdown", () => {
  it("returns original content when frontmatter exists", () => {
    // Arrange
    const body = ["---", "title: Already", "---", "", "Body"].join("\n");
    const draft = {
      body,
      index: true,
      publishedAt: "2026-02-01",
      summary: "Summary",
      tags: ["tag"],
      title: "Ignored",
    };
    const date = new Date("2026-02-01T00:00:00Z");

    // Act
    const result = buildMarkdown(draft, date);

    // Assert
    expect(result).toBe(body.trimStart());
  });

  it("builds frontmatter with normalized fields", () => {
    // Arrange
    const draft = {
      body: "Body text",
      index: false,
      publishedAt: "2026-02-01",
      summary: "  ",
      tags: ["tag", "tag", "Other"],
      title: "A title",
    };
    const date = new Date("2026-02-01T00:00:00Z");

    // Act
    const result = buildMarkdown(draft, date);

    // Assert
    expect(result).toContain("title: 'A title'");
    expect(result).toContain("publishedAt: '2026-02-01'");
    expect(result).toContain("summary:");
    expect(result).toContain("tags: ['tag', 'Other']");
    expect(result).toContain("index: false");
    expect(result.endsWith("Body text\n")).toBe(true);
  });

  it("normalizes publishedAt when the format is not yyyy-mm-dd", () => {
    // Arrange
    const draft = {
      body: "Body",
      index: true,
      publishedAt: "2026/02/01",
      summary: "Summary",
      tags: [],
      title: "Title",
    };
    const date = new Date("2026-02-02T03:04:05Z");

    // Act
    const result = buildMarkdown(draft, date);

    // Assert
    expect(result).toContain("publishedAt: '2026-02-02'");
  });
});

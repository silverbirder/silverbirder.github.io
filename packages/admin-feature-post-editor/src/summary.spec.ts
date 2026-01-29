import { describe, expect, it } from "vitest";

import { buildSummaryFromBody } from "./summary";

describe("buildSummaryFromBody", () => {
  it("returns plain text summary from markdown", () => {
    // Arrange
    const body = [
      "# Title",
      "",
      "This is **bold** text with a [link](https://example.com).",
      "",
      "- Item one",
      "- Item two",
    ].join("\n");

    // Act
    const summary = buildSummaryFromBody(body, 120);

    // Assert
    expect(summary).toBe(
      "Title This is bold text with a link. Item one Item two",
    );
  });

  it("trims the summary to the max length", () => {
    // Arrange
    const body = "A".repeat(200);

    // Act
    const summary = buildSummaryFromBody(body, 40);

    // Assert
    expect(summary.length).toBe(40);
    expect(summary).toBe("A".repeat(40));
  });

  it("ignores fenced code blocks and frontmatter", () => {
    // Arrange
    const body = [
      "---",
      "title: Example",
      "---",
      "",
      "Intro text.",
      "",
      "```ts",
      "const secret = 'skip';",
      "```",
      "",
      "More text.",
    ].join("\n");

    // Act
    const summary = buildSummaryFromBody(body, 120);

    // Assert
    expect(summary).toBe("Intro text. More text.");
  });
});

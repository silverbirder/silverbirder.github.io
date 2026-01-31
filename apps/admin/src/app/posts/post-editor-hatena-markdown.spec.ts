import { describe, expect, it } from "vitest";

import { buildHatenaMarkdown } from "./post-editor-hatena-markdown";

describe("buildHatenaMarkdown", () => {
  it("builds a title-first markdown body", () => {
    const result = buildHatenaMarkdown({
      body: "Body text",
      title: "Hatena Title",
    });

    expect(result).toContain("Title: Hatena Title");
    expect(result).toContain("Draft: true");
    expect(result).toContain("\n\nBody text");
  });
});

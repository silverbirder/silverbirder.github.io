import { describe, expect, it } from "vitest";

import { buildZennMarkdown } from "./post-editor-zenn-markdown";

describe("buildZennMarkdown", () => {
  it("builds frontmatter with type, topics and published false", () => {
    const result = buildZennMarkdown({
      body: "Hello Zenn",
      title: "My Article",
      topics: ["misc"],
      type: "tech",
    });

    expect(result).toContain("title: 'My Article'");
    expect(result).toContain("type: 'tech'");
    expect(result).toContain("topics: ['misc']");
    expect(result).toContain("published: false");
    expect(result).toContain("Hello Zenn");
  });
});

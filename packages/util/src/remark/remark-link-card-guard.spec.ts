import { describe, expect, it } from "vitest";

import { createRemarkLinkCardGuard } from "./remark-link-card-guard";

const createTree = (url: string, text = url) => ({
  children: [
    {
      children: [
        {
          children: [{ type: "text", value: text }],
          type: "link",
          url,
        },
      ],
      type: "paragraph",
    },
  ],
  type: "root",
});

describe("createRemarkLinkCardGuard", () => {
  it("changes Twitter/X status links to avoid link card conversion", async () => {
    const tree = createTree(
      "https://twitter.com/silverbirder/status/1318861346327252993",
    );

    const transform = createRemarkLinkCardGuard();
    await transform(tree);

    const link = tree.children[0]?.children?.[0];
    const text = link?.children?.[0]?.value;
    expect(text).toBe("tweet");
  });

  it("leaves non-twitter links untouched", async () => {
    const tree = createTree("https://example.com");

    const transform = createRemarkLinkCardGuard();
    await transform(tree);

    const link = tree.children[0]?.children?.[0];
    const text = link?.children?.[0]?.value;
    expect(text).toBe("https://example.com");
  });

  it("does not change links with non-matching text", async () => {
    const tree = createTree(
      "https://x.com/silverbirder/status/1318861346327252993",
      "Tweet",
    );

    const transform = createRemarkLinkCardGuard();
    await transform(tree);

    const link = tree.children[0]?.children?.[0];
    const text = link?.children?.[0]?.value;
    expect(text).toBe("Tweet");
  });
});

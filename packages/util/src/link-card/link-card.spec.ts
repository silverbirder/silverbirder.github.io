import { describe, expect, it } from "vitest";

import {
  createRemarkLinkCard,
  extractStandaloneLinkUrls,
  normalizeLinkCardUrl,
} from "./link-card";

describe("extractStandaloneLinkUrls", () => {
  it("collects only standalone URL paragraphs", () => {
    const tree = {
      children: [
        {
          children: [
            {
              children: [{ type: "text", value: "https://example.com" }],
              type: "link",
              url: "https://example.com",
            },
          ],
          type: "paragraph",
        },
        {
          children: [
            { type: "text", value: "before " },
            {
              children: [{ type: "text", value: "https://example.com" }],
              type: "link",
              url: "https://example.com",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "root",
    };

    expect(extractStandaloneLinkUrls(tree)).toEqual(["https://example.com/"]);
  });
});

describe("createRemarkLinkCard", () => {
  it("replaces a standalone URL paragraph with a LinkCard mdx node", async () => {
    const tree = {
      children: [
        {
          children: [
            {
              children: [{ type: "text", value: "https://example.com" }],
              type: "link",
              url: "https://example.com",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "root",
    };

    const transform = createRemarkLinkCard({
      resolveCard: async (url) => ({
        description: "Example description",
        faviconSrc: "/link-card/favicon.png",
        siteName: "Example",
        thumbnailSrc: "/link-card/thumbnail.png",
        title: "Example title",
        url,
      }),
    });

    await transform(tree);

    expect(tree).toEqual({
      children: [
        {
          attributes: [
            {
              name: "url",
              type: "mdxJsxAttribute",
              value: "https://example.com/",
            },
            { name: "title", type: "mdxJsxAttribute", value: "Example title" },
            {
              name: "description",
              type: "mdxJsxAttribute",
              value: "Example description",
            },
            { name: "siteName", type: "mdxJsxAttribute", value: "Example" },
            {
              name: "faviconSrc",
              type: "mdxJsxAttribute",
              value: "/link-card/favicon.png",
            },
            {
              name: "thumbnailSrc",
              type: "mdxJsxAttribute",
              value: "/link-card/thumbnail.png",
            },
          ],
          children: [],
          data: {
            _mdxExplicitJsx: true,
          },
          name: "LinkCard",
          type: "mdxJsxFlowElement",
        },
      ],
      type: "root",
    });
  });
});

describe("normalizeLinkCardUrl", () => {
  it("removes query parameters and fragments", () => {
    expect(
      normalizeLinkCardUrl("https://example.com/path?ref=abc#section"),
    ).toBe("https://example.com/path");
  });
});

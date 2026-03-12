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

  it("does not collect markdown links when raw markdown is provided", () => {
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
          position: {
            end: { offset: 38 },
            start: { offset: 0 },
          },
          type: "paragraph",
        },
      ],
      type: "root",
    };

    expect(
      extractStandaloneLinkUrls(
        tree,
        "[https://example.com](https://example.com)",
      ),
    ).toEqual([]);
  });

  it("does not collect standalone YouTube or Instagram URLs", () => {
    const tree = {
      children: [
        {
          children: [
            {
              children: [
                {
                  type: "text",
                  value: "https://www.youtube.com/watch?v=gFRtAAmiFbE",
                },
              ],
              type: "link",
              url: "https://www.youtube.com/watch?v=gFRtAAmiFbE",
            },
          ],
          type: "paragraph",
        },
        {
          children: [
            {
              children: [
                {
                  type: "text",
                  value: "https://www.instagram.com/p/ABC123/",
                },
              ],
              type: "link",
              url: "https://www.instagram.com/p/ABC123/",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "root",
    };

    expect(extractStandaloneLinkUrls(tree)).toEqual([]);
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

  it("does not replace markdown links even when text equals the URL", async () => {
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
          position: {
            end: { offset: 38 },
            start: { offset: 0 },
          },
          type: "paragraph",
        },
      ],
      type: "root",
    };

    const transform = createRemarkLinkCard({
      resolveCard: async (url) => ({
        title: "Example title",
        url,
      }),
    });

    await transform(tree, {
      value: "[https://example.com](https://example.com)",
    });

    expect(tree.children?.[0]?.type).toBe("paragraph");
  });

  it("omits optional attrs when metadata does not include image fields", async () => {
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
  it("keeps query parameters and removes fragments", () => {
    expect(
      normalizeLinkCardUrl("https://example.com/path?ref=abc#section"),
    ).toBe("https://example.com/path?ref=abc");
  });
});

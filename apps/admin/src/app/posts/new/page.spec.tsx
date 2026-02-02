import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const renderPage = async () => {
  vi.resetModules();

  vi.doMock("@/app/actions", () => ({
    createPostPullRequest: vi.fn(),
    fixMarkdownLint: vi.fn(),
    resolveLinkTitles: vi.fn(),
    resolvePreview: vi.fn(),
    uploadImage: vi.fn(),
  }));
  vi.doMock("@/trpc/server", () => ({
    api: {
      github: {
        listTags: vi.fn().mockResolvedValue(["tag"]),
      },
    },
  }));

  vi.doMock("@repo/admin-feature-post-editor", () => ({
    PostEditor: () =>
      React.createElement("div", {
        "data-testid": "post-editor",
      }),
  }));

  const mod = await import("./page");
  const element = await mod.default();
  return renderToStaticMarkup(element);
};

describe("Post editor page", () => {
  it("renders the post editor feature", async () => {
    const markup = await renderPage();

    expect(markup).toContain('data-testid="post-editor"');
  });
});

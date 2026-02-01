import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const renderPage = async () => {
  vi.resetModules();

  vi.doMock("@/app/actions", () => ({
    resolveLinkTitles: vi.fn(),
    resolvePreview: vi.fn(),
    updatePostPullRequest: vi.fn(),
    uploadImage: vi.fn(),
  }));

  vi.doMock("@/trpc/server", () => ({
    api: {
      github: {
        getPost: vi.fn().mockResolvedValue({
          body: "body",
          index: false,
          publishedAt: "2026-02-01",
          summary: "summary",
          tags: ["tag"],
          title: "title",
        }),
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
  const element = await mod.default({
    params: Promise.resolve({ slug: "example" }),
  });
  return renderToStaticMarkup(element);
};

describe("Post editor edit page", () => {
  it("renders the post editor feature", async () => {
    const markup = await renderPage();

    expect(markup).toContain('data-testid="post-editor"');
  });
});

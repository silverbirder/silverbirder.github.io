import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const renderPage = async () => {
  vi.resetModules();

  vi.doMock("@/app/actions/resolve-preview", () => ({
    resolvePreview: vi.fn(),
  }));
  vi.doMock("@/app/actions/resolve-link-titles", () => ({
    resolveLinkTitles: vi.fn(),
  }));
  vi.doMock("@/app/actions/upload-image", () => ({
    uploadImage: vi.fn(),
  }));

  vi.doMock("@repo/admin-feature-post-editor", () => ({
    PostEditor: () =>
      React.createElement("div", {
        "data-testid": "post-editor",
      }),
  }));

  vi.doMock("./post-editor-with-pull-request", () => ({
    PostEditorWithPullRequest: () =>
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

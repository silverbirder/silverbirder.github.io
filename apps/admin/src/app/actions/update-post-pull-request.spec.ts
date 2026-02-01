import { describe, expect, it, vi } from "vitest";

const loadAction = async ({
  updatePullRequestImpl,
}: {
  updatePullRequestImpl?: () => Promise<{ url: null | string }>;
} = {}) => {
  vi.resetModules();

  const updatePullRequest = vi
    .fn()
    .mockImplementation(
      updatePullRequestImpl ??
        (() => Promise.resolve({ url: "https://example.com/pr" })),
    );

  vi.doMock("@/trpc/server", () => ({
    api: {
      github: {
        updatePullRequest,
      },
    },
  }));

  vi.doMock("next-intl/server", () => ({
    getTranslations: async () => (key: string) => `message:${key}`,
  }));

  vi.doMock("@repo/admin-feature-post-editor/libs", () => ({
    buildMarkdown: () => "markdown",
    parsePublishedAtDate: () => new Date("2026-02-01T00:00:00Z"),
  }));

  const mod = await import("./update-post-pull-request");

  return {
    updatePostPullRequest: mod.updatePostPullRequest,
    updatePullRequest,
  };
};

describe("updatePostPullRequest", () => {
  it("returns an open action when update succeeds", async () => {
    const { updatePostPullRequest, updatePullRequest } = await loadAction();

    const result = await updatePostPullRequest("example.md", {
      body: "Hello",
      hatena: { enabled: false },
      index: false,
      publishedAt: "2026-02-01",
      summary: "",
      tags: [],
      title: "Title",
      zenn: { enabled: false, slug: "zenn", topics: [], type: "tech" },
    });

    expect(updatePullRequest).toHaveBeenCalledWith({
      content: "markdown",
      fileName: "example.md",
      pullRequestTitle: "Title",
    });
    expect(result).toEqual({
      actions: [{ type: "open", url: "https://example.com/pr" }],
    });
  });

  it("returns an error action when update fails", async () => {
    const { updatePostPullRequest, updatePullRequest } = await loadAction({
      updatePullRequestImpl: () => Promise.reject(new Error("failed")),
    });

    const result = await updatePostPullRequest("example.md", {
      body: "Hello",
      hatena: { enabled: false },
      index: false,
      publishedAt: "2026-02-01",
      summary: "",
      tags: [],
      title: "Title",
      zenn: { enabled: false, slug: "zenn", topics: [], type: "tech" },
    });

    expect(updatePullRequest).toHaveBeenCalledOnce();
    expect(result).toEqual({
      actions: [{ message: "message:createPullRequestError", type: "alert" }],
    });
  });
});

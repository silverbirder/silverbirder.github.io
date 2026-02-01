import { describe, expect, it, vi } from "vitest";

const loadAction = async ({
  createPullRequestImpl,
}: {
  createPullRequestImpl?: () => Promise<{ url: null | string }>;
} = {}) => {
  vi.resetModules();

  const list = vi.fn().mockResolvedValue(["20260101.md"]);
  const createPullRequest = vi
    .fn()
    .mockImplementation(
      createPullRequestImpl ??
        (() => Promise.resolve({ url: "https://example.com/pr" })),
    );
  const createZennPullRequest = vi.fn().mockResolvedValue({
    url: "https://example.com/zenn-pr",
  });
  const createDraft = vi.fn().mockResolvedValue({
    editUrl: null,
    previewUrl: "https://example.com/hatena-preview",
  });

  vi.doMock("@/trpc/server", () => ({
    api: {
      github: {
        createPullRequest,
        list,
      },
      hatena: {
        createDraft,
      },
      zenn: {
        createPullRequest: createZennPullRequest,
      },
    },
  }));

  vi.doMock("next-intl/server", () => ({
    getTranslations: async () => (key: string) => `message:${key}`,
  }));

  vi.doMock("@repo/admin-feature-post-editor/libs", () => ({
    buildMarkdown: () => "markdown",
    buildZennMarkdown: () => "zenn-markdown",
    getUniqueDailyFileName: () => "20260201.md",
    parsePublishedAtDate: () => new Date("2026-02-01T00:00:00Z"),
  }));

  const mod = await import("./create-post-pull-request");

  return {
    createDraft,
    createPostPullRequest: mod.createPostPullRequest,
    createPullRequest,
    createZennPullRequest,
    list,
  };
};

describe("createPostPullRequest", () => {
  it("returns open actions for Zenn, Hatena, and GitHub", async () => {
    const {
      createDraft,
      createPostPullRequest,
      createPullRequest,
      createZennPullRequest,
      list,
    } = await loadAction();

    const result = await createPostPullRequest({
      body: "Hello",
      hatena: { enabled: true },
      index: false,
      publishedAt: "2026-02-01",
      summary: "",
      tags: ["tag"],
      title: "Title",
      zenn: {
        enabled: true,
        slug: "zenn-slug",
        topics: ["topic"],
        type: "tech",
      },
    });

    expect(list).toHaveBeenCalledOnce();
    expect(createPullRequest).toHaveBeenCalledWith({
      content: "markdown",
      fileName: "20260201.md",
      pullRequestTitle: "Title",
    });
    expect(createZennPullRequest).toHaveBeenCalledWith({
      content: "zenn-markdown",
      fileName: "zenn-slug",
      pullRequestTitle: "Title",
    });
    expect(createDraft).toHaveBeenCalledWith({
      body: "Hello",
      title: "Title",
    });
    expect(result).toEqual({
      actions: [
        { type: "open", url: "https://example.com/zenn-pr" },
        { type: "open", url: "https://example.com/hatena-preview" },
        { type: "open", url: "https://example.com/pr" },
      ],
    });
  });

  it("returns a pull request error action when GitHub creation fails", async () => {
    const {
      createDraft,
      createPostPullRequest,
      createPullRequest,
      createZennPullRequest,
    } = await loadAction({
      createPullRequestImpl: () => Promise.reject(new Error("failed")),
    });

    const result = await createPostPullRequest({
      body: "Hello",
      hatena: { enabled: true },
      index: false,
      publishedAt: "2026-02-01",
      summary: "",
      tags: [],
      title: "Title",
      zenn: {
        enabled: true,
        slug: "zenn-slug",
        topics: ["topic"],
        type: "tech",
      },
    });

    expect(createPullRequest).toHaveBeenCalledOnce();
    expect(createZennPullRequest).not.toHaveBeenCalled();
    expect(createDraft).not.toHaveBeenCalled();
    expect(result).toEqual({
      actions: [{ message: "message:createPullRequestError", type: "alert" }],
    });
  });
});

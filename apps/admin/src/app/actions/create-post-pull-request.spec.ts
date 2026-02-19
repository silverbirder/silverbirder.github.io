import { describe, expect, it, vi } from "vitest";

const loadAction = async ({
  createPullRequestImpl,
  listImpl,
  signInSocialImpl,
}: {
  createPullRequestImpl?: () => Promise<{ url: null | string }>;
  listImpl?: () => Promise<string[]>;
  signInSocialImpl?: () => Promise<{ url: null | string }>;
} = {}) => {
  vi.resetModules();

  const list = vi
    .fn()
    .mockImplementation(listImpl ?? (() => Promise.resolve(["20260101.md"])));
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
  const signInSocial = vi
    .fn()
    .mockImplementation(
      signInSocialImpl ??
        (() => Promise.resolve({ url: "https://example.com/oauth" })),
    );

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
  vi.doMock("@/server/better-auth", () => ({
    auth: {
      api: {
        signInSocial,
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
    signInSocial,
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
      draftId: "draft-1",
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
        { type: "clearDraft" },
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
      draftId: "draft-1",
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

  it("returns sign-in guidance when authentication is required", async () => {
    const { createPostPullRequest, list, signInSocial } = await loadAction({
      listImpl: () =>
        Promise.reject({
          code: "UNAUTHORIZED",
        }),
    });

    const result = await createPostPullRequest({
      body: "Hello",
      draftId: "draft-1",
      hatena: { enabled: false },
      index: false,
      publishedAt: "2026-02-01",
      summary: "",
      tags: [],
      title: "Title",
      zenn: {
        enabled: false,
        slug: "zenn-slug",
        topics: [],
        type: "tech",
      },
    });

    expect(list).toHaveBeenCalledOnce();
    expect(signInSocial).toHaveBeenCalledWith({
      body: {
        callbackURL: "/posts/new?draftId=draft-1&resumePullRequest=1",
        provider: "github",
      },
    });
    expect(result).toEqual({
      actions: [{ type: "redirect", url: "https://example.com/oauth" }],
    });
  });

  it("returns forbidden guidance when user is not allowed", async () => {
    const { createPostPullRequest, list, signInSocial } = await loadAction({
      listImpl: () =>
        Promise.reject({
          code: "FORBIDDEN",
        }),
    });

    const result = await createPostPullRequest({
      body: "Hello",
      draftId: "draft-1",
      hatena: { enabled: false },
      index: false,
      publishedAt: "2026-02-01",
      summary: "",
      tags: [],
      title: "Title",
      zenn: {
        enabled: false,
        slug: "zenn-slug",
        topics: [],
        type: "tech",
      },
    });

    expect(list).toHaveBeenCalledOnce();
    expect(signInSocial).not.toHaveBeenCalled();
    expect(result).toEqual({
      actions: [
        {
          message: "message:createPullRequestForbidden",
          type: "alert",
        },
        { type: "open", url: "/sign-in" },
      ],
    });
  });
});

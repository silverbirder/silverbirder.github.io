import { describe, expect, it, vi } from "vitest";

const loadAction = async ({
  pushDraftsToGistsImpl,
  signInSocialImpl,
}: {
  pushDraftsToGistsImpl?: () => Promise<{ count: number }>;
  signInSocialImpl?: () => Promise<{ url: null | string }>;
} = {}) => {
  vi.resetModules();

  const pushDraftsToGists = vi
    .fn()
    .mockImplementation(
      pushDraftsToGistsImpl ?? (() => Promise.resolve({ count: 1 })),
    );
  const signInSocial = vi
    .fn()
    .mockImplementation(
      signInSocialImpl ??
        (() => Promise.resolve({ url: "https://example.com/oauth" })),
    );

  vi.doMock("next-intl/server", () => ({
    getTranslations: async () => (key: string) => key,
  }));

  vi.doMock("@/trpc/server", () => ({
    api: {
      github: {
        pushDraftsToGists,
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

  const mod = await import("./push-post-drafts-to-gists");

  return {
    pushDraftsToGists,
    pushPostDraftsToGists: mod.pushPostDraftsToGists,
    signInSocial,
  };
};

const draft = {
  body: "body",
  hatenaEnabled: false,
  id: "draft-1",
  publishedAt: "2026-02-19",
  summary: "summary",
  tags: ["tag"],
  title: "title",
  updatedAt: "2026-02-19T12:00:00.000Z",
  zennEnabled: false,
  zennType: "tech",
};

describe("pushPostDraftsToGists", () => {
  it("pushes drafts and returns success alert", async () => {
    const { pushDraftsToGists, pushPostDraftsToGists } = await loadAction();

    const result = await pushPostDraftsToGists({
      drafts: [draft],
    });

    expect(pushDraftsToGists).toHaveBeenCalledWith({
      drafts: [draft],
    });
    expect(result.actions).toEqual([
      { message: "draftSyncPushSuccess", type: "alert" },
    ]);
  });

  it("redirects to social sign in when unauthorized", async () => {
    const { pushPostDraftsToGists, signInSocial } = await loadAction({
      pushDraftsToGistsImpl: () =>
        Promise.reject({
          code: "UNAUTHORIZED",
        }),
    });

    const result = await pushPostDraftsToGists({
      drafts: [draft],
    });

    expect(signInSocial).toHaveBeenCalledWith({
      body: {
        callbackURL: "/?resumeDraftSync=push",
        provider: "github",
      },
    });
    expect(result.actions).toEqual([
      { type: "redirect", url: "https://example.com/oauth" },
    ]);
  });
});

import { describe, expect, it, vi } from "vitest";

const loadAction = async ({
  pullDraftsFromGistsImpl,
  signInSocialImpl,
}: {
  pullDraftsFromGistsImpl?: () => Promise<{
    drafts: Array<{
      body: string;
      hatenaEnabled: boolean;
      id: string;
      publishedAt: string;
      summary: string;
      tags: string[];
      title: string;
      updatedAt: string;
      zennEnabled: boolean;
      zennType: string;
    }>;
  }>;
  signInSocialImpl?: () => Promise<{ url: null | string }>;
} = {}) => {
  vi.resetModules();

  const pullDraftsFromGists = vi
    .fn()
    .mockImplementation(
      pullDraftsFromGistsImpl ?? (() => Promise.resolve({ drafts: [] })),
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
        pullDraftsFromGists,
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

  const mod = await import("./pull-post-drafts-from-gists");

  return {
    pullDraftsFromGists,
    pullPostDraftsFromGists: mod.pullPostDraftsFromGists,
    signInSocial,
  };
};

describe("pullPostDraftsFromGists", () => {
  it("pulls drafts and returns replacement + success alert", async () => {
    const { pullDraftsFromGists, pullPostDraftsFromGists } = await loadAction({
      pullDraftsFromGistsImpl: () =>
        Promise.resolve({
          drafts: [
            {
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
            },
          ],
        }),
    });

    const result = await pullPostDraftsFromGists();

    expect(pullDraftsFromGists).toHaveBeenCalledOnce();
    expect(result.actions).toEqual([
      {
        drafts: [
          {
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
          },
        ],
        type: "replaceLocalDrafts",
      },
      { message: "draftSyncPullSuccess", type: "alert" },
    ]);
  });

  it("redirects to social sign in when unauthorized", async () => {
    const { pullPostDraftsFromGists, signInSocial } = await loadAction({
      pullDraftsFromGistsImpl: () =>
        Promise.reject({
          code: "UNAUTHORIZED",
        }),
    });

    const result = await pullPostDraftsFromGists();

    expect(signInSocial).toHaveBeenCalledWith({
      body: {
        callbackURL: "/?resumeDraftSync=pull",
        provider: "github",
      },
    });
    expect(result.actions).toEqual([
      { type: "redirect", url: "https://example.com/oauth" },
    ]);
  });
});

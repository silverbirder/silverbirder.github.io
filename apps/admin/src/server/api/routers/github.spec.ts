import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: {
    ADMIN_ALLOWED_EMAILS: "allowed@example.com",
    CONTENT_GITHUB_BASE_BRANCH: "main",
    CONTENT_GITHUB_REPOSITORY: "silverbirder/silverbirder.github.io",
    CONTENT_POSTS_PATH: "packages/content/posts",
  },
}));

const { getAccessToken } = vi.hoisted(() => ({
  getAccessToken: vi.fn(),
}));

vi.mock("@/server/better-auth", () => ({
  auth: {
    api: {
      getAccessToken,
    },
  },
}));

const { access, readdir, readFile } = vi.hoisted(() => ({
  access: vi.fn(),
  readdir: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  access,
  readdir,
  readFile,
}));

let requestMock = vi.fn();

vi.mock("octokit", () => ({
  Octokit: class {
    request = (...args: Parameters<typeof requestMock>) => requestMock(...args);
  },
}));

import { githubRouter } from "./github";

const createCaller = createCallerFactory(githubRouter);
const allowedUser = {
  createdAt: new Date(),
  email: "allowed@example.com",
  emailVerified: true,
  id: "user-1",
  name: "Allowed User",
  updatedAt: new Date(),
};
const allowedSession = {
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  id: "session-1",
  token: "session-token",
  updatedAt: new Date(),
  userId: "user-1",
};

afterEach(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("githubRouter.list", () => {
  it("returns markdown file names sorted by publishedAt desc", async () => {
    access.mockResolvedValue(undefined);
    readdir.mockResolvedValue([
      { isFile: () => true, name: "b.md" },
      { isFile: () => true, name: "a.md" },
      { isFile: () => true, name: "note.txt" },
      { isFile: () => false, name: "assets" },
    ]);
    readFile.mockImplementation(async (filePath: string) => {
      if (filePath.endsWith("b.md")) {
        return '---\npublishedAt: "2026-01-02"\n---\nPost b';
      }
      if (filePath.endsWith("a.md")) {
        return '---\npublishedAt: "2026-01-01"\n---\nPost a';
      }
      return "";
    });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.list();

    expect(result).toEqual(["b.md", "a.md"]);
    expect(access).toHaveBeenCalled();
    expect(readdir).toHaveBeenCalled();
    expect(readFile).toHaveBeenCalledTimes(2);
  });

  it("returns an empty list when response is not an array", async () => {
    access.mockRejectedValue(new Error("missing"));
    getAccessToken.mockResolvedValue({ accessToken: "test-token" });
    requestMock = vi.fn().mockResolvedValue({
      data: { message: "Not found" },
    });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.list();

    expect(result).toEqual([]);
  });
});

describe("githubRouter.createPullRequest", () => {
  it("creates a branch, commits a file, and opens a pull request", async () => {
    getAccessToken.mockResolvedValue({ accessToken: "test-token" });
    requestMock = vi
      .fn()
      .mockResolvedValueOnce({ data: { object: { sha: "base-sha" } } })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({
        data: { html_url: "https://example/pr/1", number: 1 },
      });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.createPullRequest({
      content: "# hello",
      fileName: "20260114.md",
      pullRequestBody: "body",
      pullRequestTitle: "title",
    });

    expect(result.url).toBe("https://example/pr/1");
    expect(result.number).toBe(1);
    expect(result.filePath).toBe("packages/content/posts/20260114.md");
    expect(requestMock).toHaveBeenCalled();

    const calls = requestMock.mock.calls.map((call) => call[0]);
    expect(calls).toContain("GET /repos/{owner}/{repo}/git/ref/{ref}");
    expect(calls).toContain("POST /repos/{owner}/{repo}/git/refs");
    expect(calls).toContain("PUT /repos/{owner}/{repo}/contents/{path}");
    expect(calls).toContain("POST /repos/{owner}/{repo}/pulls");
  });
});

describe("githubRouter.listTags", () => {
  it("returns tags sorted from local markdown files", async () => {
    access.mockResolvedValue(undefined);
    readdir.mockResolvedValue([
      { isFile: () => true, name: "first.md" },
      { isFile: () => true, name: "second.md" },
      { isFile: () => false, name: "assets" },
    ]);
    readFile.mockImplementation(async (filePath: string) => {
      if (filePath.endsWith("first.md")) {
        return "---\ntags: ['alpha', 'beta']\n---\nPost";
      }
      if (filePath.endsWith("second.md")) {
        return "---\ntags: ['beta', 'gamma']\n---\nPost";
      }
      return "";
    });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.listTags();

    expect(result).toEqual(["alpha", "beta", "gamma"]);
    expect(access).toHaveBeenCalled();
    expect(readdir).toHaveBeenCalled();
    expect(readFile).toHaveBeenCalledTimes(2);
  });
});

describe("githubRouter.pushDraftsToGists", () => {
  it("upserts drafts to gists using draft id in description", async () => {
    getAccessToken.mockResolvedValue({ accessToken: "test-token" });
    requestMock = vi
      .fn()
      .mockResolvedValueOnce({
        data: [
          {
            description: "silverbirder-admin-draft:draft-1",
            id: "gist-1",
          },
        ],
      })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.pushDraftsToGists({
      drafts: [
        {
          body: "body-1",
          hatenaEnabled: false,
          id: "draft-1",
          publishedAt: "2026-02-18",
          summary: "summary-1",
          tags: ["tag-1"],
          title: "title-1",
          updatedAt: "2026-02-18T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
        {
          body: "body-2",
          hatenaEnabled: false,
          id: "draft-2",
          publishedAt: "2026-02-19",
          summary: "summary-2",
          tags: ["tag-2"],
          title: "title-2",
          updatedAt: "2026-02-19T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
      ],
    });

    expect(result).toEqual({ count: 2 });
    expect(requestMock).toHaveBeenCalledWith("GET /gists", {
      page: 1,
      per_page: 100,
    });
    expect(requestMock).toHaveBeenCalledWith("PATCH /gists/{gist_id}", {
      description: "silverbirder-admin-draft:draft-1",
      files: {
        "draft.json": {
          content: expect.any(String),
        },
      },
      gist_id: "gist-1",
    });
    expect(requestMock).toHaveBeenCalledWith("POST /gists", {
      description: "silverbirder-admin-draft:draft-2",
      files: {
        "draft.json": {
          content: expect.any(String),
        },
      },
      public: false,
    });
  });
});

describe("githubRouter.pullDraftsFromGists", () => {
  it("returns all draft gists and deletes them", async () => {
    getAccessToken.mockResolvedValue({ accessToken: "test-token" });
    requestMock = vi
      .fn()
      .mockResolvedValueOnce({
        data: [
          {
            description: "silverbirder-admin-draft:draft-1",
            id: "gist-1",
          },
          {
            description: "silverbirder-admin-draft:draft-2",
            id: "gist-2",
          },
          {
            description: "other",
            id: "gist-other",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          files: {
            "draft.json": {
              content: JSON.stringify({
                body: "body-1",
                hatenaEnabled: false,
                id: "draft-1",
                publishedAt: "2026-02-18",
                summary: "summary-1",
                tags: ["tag-1"],
                title: "title-1",
                updatedAt: "2026-02-18T12:00:00.000Z",
                zennEnabled: false,
                zennType: "tech",
              }),
            },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          files: {
            "draft.json": {
              content: JSON.stringify({
                body: "body-2",
                hatenaEnabled: false,
                id: "draft-2",
                publishedAt: "2026-02-19",
                summary: "summary-2",
                tags: ["tag-2"],
                title: "title-2",
                updatedAt: "2026-02-19T12:00:00.000Z",
                zennEnabled: false,
                zennType: "tech",
              }),
            },
          },
        },
      })
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({ data: {} });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.pullDraftsFromGists();

    expect(result).toEqual({
      drafts: [
        {
          body: "body-2",
          hatenaEnabled: false,
          id: "draft-2",
          publishedAt: "2026-02-19",
          summary: "summary-2",
          tags: ["tag-2"],
          title: "title-2",
          updatedAt: "2026-02-19T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
        {
          body: "body-1",
          hatenaEnabled: false,
          id: "draft-1",
          publishedAt: "2026-02-18",
          summary: "summary-1",
          tags: ["tag-1"],
          title: "title-1",
          updatedAt: "2026-02-18T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
      ],
    });
    expect(requestMock).toHaveBeenCalledWith("GET /gists", {
      page: 1,
      per_page: 100,
    });
    expect(requestMock).toHaveBeenCalledWith("GET /gists/{gist_id}", {
      gist_id: "gist-1",
    });
    expect(requestMock).toHaveBeenCalledWith("GET /gists/{gist_id}", {
      gist_id: "gist-2",
    });
    expect(requestMock).toHaveBeenCalledWith("DELETE /gists/{gist_id}", {
      gist_id: "gist-1",
    });
    expect(requestMock).toHaveBeenCalledWith("DELETE /gists/{gist_id}", {
      gist_id: "gist-2",
    });
  });
});

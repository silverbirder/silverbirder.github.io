import { afterEach, describe, expect, it, vi } from "vitest";

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

describe("githubRouter.list", () => {
  it("returns sorted markdown file names", async () => {
    getAccessToken.mockResolvedValue({ accessToken: "test-token" });
    requestMock = vi.fn().mockResolvedValue({
      data: [
        { name: "b.md", path: "packages/content/posts/b.md", type: "file" },
        { name: "a.md", path: "packages/content/posts/a.md", type: "file" },
        {
          name: "note.txt",
          path: "packages/content/posts/note.txt",
          type: "file",
        },
        { name: "assets", path: "packages/content/posts/assets", type: "dir" },
      ],
    });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.list();

    expect(result).toEqual(["a.md", "b.md"]);
    expect(requestMock).toHaveBeenCalledOnce();
  });

  it("returns an empty list when response is not an array", async () => {
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

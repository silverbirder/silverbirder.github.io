import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: {
    ADMIN_ALLOWED_EMAILS: "allowed@example.com",
    ZENN_ARTICLES_PATH: "articles",
    ZENN_GITHUB_BASE_BRANCH: "main",
    ZENN_GITHUB_REPOSITORY: "silverbirder/zenn",
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

import { zennRouter } from "./zenn";

const createCaller = createCallerFactory(zennRouter);
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

describe("zennRouter.createPullRequest", () => {
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
      fileName: "abcdef123456.md",
      pullRequestBody: "body",
      pullRequestTitle: "title",
    });

    expect(result.url).toBe("https://example/pr/1");
    expect(result.number).toBe(1);
    expect(result.filePath).toBe("articles/abcdef123456.md");
    expect(requestMock).toHaveBeenCalled();

    const calls = requestMock.mock.calls.map((call) => call[0]);
    expect(calls).toContain("GET /repos/{owner}/{repo}/git/ref/{ref}");
    expect(calls).toContain("POST /repos/{owner}/{repo}/git/refs");
    expect(calls).toContain("PUT /repos/{owner}/{repo}/contents/{path}");
    expect(calls).toContain("POST /repos/{owner}/{repo}/pulls");
  });
});

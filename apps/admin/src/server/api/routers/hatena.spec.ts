import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: {
    ADMIN_ALLOWED_EMAILS: "allowed@example.com",
    HATENA_GITHUB_BASE_BRANCH: "main",
    HATENA_GITHUB_REPOSITORY: "silverbirder/hatena",
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

import { hatenaRouter } from "./hatena";

const createCaller = createCallerFactory(hatenaRouter);
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

describe("hatenaRouter.createPullRequest", () => {
  it("dispatches the draft workflow and updates the draft file content", async () => {
    getAccessToken.mockResolvedValue({ accessToken: "test-token" });
    requestMock = vi
      .fn()
      .mockResolvedValueOnce({ data: {} })
      .mockResolvedValueOnce({
        data: [
          {
            head: { ref: "hatena/test-branch" },
            html_url: "https://example/pr/1",
            number: 1,
            title: "Hatena Draft Title",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: [
          {
            name: "draft.md",
            path: "draft_entries/draft.md",
            type: "file",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          content: Buffer.from(
            "---\nTitle: Hatena Draft Title\nDraft: true\n---\n\nOld body",
            "utf8",
          ).toString("base64"),
          encoding: "base64",
          sha: "file-sha",
        },
      })
      .mockResolvedValueOnce({ data: {} });

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.createPullRequest({
      content: "---\nTitle: Hatena Draft Title\nDraft: true\n---\n\nHello",
      title: "Hatena Draft Title",
    });

    expect(result.url).toBe("https://example/pr/1");
    expect(result.number).toBe(1);
    expect(result.filePath).toBe("draft_entries/draft.md");
    expect(result.branchName).toBe("hatena/test-branch");
    expect(requestMock).toHaveBeenCalled();

    const calls = requestMock.mock.calls.map((call) => call[0]);
    expect(calls).toContain(
      "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
    );
    expect(calls).toContain("GET /repos/{owner}/{repo}/pulls");
    expect(calls).toContain("GET /repos/{owner}/{repo}/contents/{path}");
    expect(calls).toContain("PUT /repos/{owner}/{repo}/contents/{path}");
  });
});

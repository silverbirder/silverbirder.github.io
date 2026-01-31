import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: {
    ADMIN_ALLOWED_EMAILS: "allowed@example.com",
    HATENA_API_KEY: "test-api-key",
    HATENA_BLOG_DOMAIN: "silverbirder.hatenablog.jp",
    HATENA_ID: "silverbirdr",
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
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("hatenaRouter.createDraft", () => {
  it("posts a draft entry and returns preview and edit URLs", async () => {
    const fetchMock = vi.fn(
      async (): Promise<Response> =>
        ({
          ok: true,
          status: 201,
          statusText: "Created",
          text: async () =>
            `<?xml version="1.0" encoding="utf-8"?>
        <entry xmlns="http://www.w3.org/2005/Atom">
          <link rel="edit" href="https://blog.hatena.ne.jp/silverbirdr/silverbirder.hatenablog.jp/atom/entry/1" />
          <link rel="preview" href="https://silverbirder.hatenablog.jp/draft/entry/1" />
        </entry>`,
        }) as Response,
    );
    vi.stubGlobal("fetch", fetchMock);

    const caller = createCaller({
      headers: new Headers(),
      session: { session: allowedSession, user: allowedUser },
    });

    const result = await caller.createDraft({
      body: "Hello from Hatena",
      title: "Hatena Draft Title",
    });

    expect(result.previewUrl).toBe(
      "https://silverbirder.hatenablog.jp/draft/entry/1",
    );
    expect(result.editUrl).toBe(
      "https://blog.hatena.ne.jp/silverbirdr/silverbirder.hatenablog.jp/atom/entry/1",
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const firstCall = fetchMock.mock.calls[0] as
      | Parameters<typeof fetch>
      | undefined;
    if (!firstCall) {
      throw new Error("fetch was not called");
    }
    const [url, options] = firstCall;
    expect(url).toBe(
      "https://blog.hatena.ne.jp/silverbirdr/silverbirder.hatenablog.jp/atom/entry",
    );
    expect(options?.method).toBe("POST");
    const headers = new Headers(options?.headers);
    expect(headers.get("Authorization") ?? "").toMatch(/^Basic /);
    expect(String(options?.body ?? "")).toContain("Hatena Draft Title");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: {
    ADMIN_ALLOWED_EMAILS: "allowed@example.com",
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

const { mkdir, readFile, writeFile } = vi.hoisted(() => ({
  mkdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  mkdir,
  readFile,
  writeFile,
}));

vi.mock("node:os", () => ({
  tmpdir: () => "/tmp",
}));

import { draftRouter } from "./draft";

const createCaller = createCallerFactory(draftRouter);
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

const createProtectedCaller = () =>
  createCaller({
    headers: new Headers(),
    session: { session: allowedSession, user: allowedUser },
  });

const createEnoentError = () => {
  const error = new Error("not found") as Error & { code?: string };
  error.code = "ENOENT";
  return error;
};

afterEach(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("draftRouter", () => {
  it("saves and lists drafts", async () => {
    readFile.mockRejectedValue(createEnoentError());

    let stored = "[]";
    writeFile.mockImplementation(async (_path: string, value: string) => {
      stored = value;
    });
    readFile.mockImplementation(async () => stored);

    const caller = createProtectedCaller();

    const saved = await caller.save({
      body: "# body",
      publishedAt: "2026-02-14",
      summary: "summary",
      tags: ["tag"],
      title: "Draft title",
    });

    const list = await caller.list();

    expect(saved.id.length).toBeGreaterThan(0);
    expect(list).toHaveLength(1);
    expect(list[0]?.id).toBe(saved.id);
    expect(list[0]?.title).toBe("Draft title");
    expect(mkdir).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();
  });

  it("gets and deletes a draft", async () => {
    const draft = {
      body: "# body",
      hatenaEnabled: false,
      id: "draft-1",
      publishedAt: "2026-02-14",
      summary: "summary",
      tags: [],
      title: "Draft",
      updatedAt: "2026-02-14T00:00:00.000Z",
      zennEnabled: false,
      zennType: "tech",
    };

    let stored = JSON.stringify([draft]);
    readFile.mockImplementation(async () => stored);
    writeFile.mockImplementation(async (_path: string, value: string) => {
      stored = value;
    });

    const caller = createProtectedCaller();

    const loaded = await caller.get({ id: "draft-1" });
    expect(loaded?.id).toBe("draft-1");

    const deleted = await caller.delete({ id: "draft-1" });
    expect(deleted.deleted).toBe(true);

    const list = await caller.list();
    expect(list).toEqual([]);
  });
});

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

afterEach(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("draftRouter", () => {
  it("save returns an id and list is empty", async () => {
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
    expect(list).toEqual([]);
  });

  it("get returns null and delete returns false", async () => {
    const caller = createProtectedCaller();

    const loaded = await caller.get({ id: "draft-1" });
    expect(loaded).toBeNull();

    const deleted = await caller.delete({ id: "draft-1" });
    expect(deleted.deleted).toBe(false);
  });
});

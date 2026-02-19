import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({
  env: {
    BETTER_AUTH_GITHUB_CLIENT_ID: "github-client-id",
    BETTER_AUTH_GITHUB_CLIENT_SECRET: "github-client-secret",
  },
}));

describe("better-auth session config", () => {
  it("sets 3-minute expiry and cookie cache", async () => {
    const { sessionConfig } = await import("./config");

    expect(sessionConfig.expiresIn).toBe(60 * 3);
    expect(sessionConfig.disableSessionRefresh).toBe(true);
    expect(sessionConfig.cookieCache?.maxAge).toBe(60 * 3);
  });
});

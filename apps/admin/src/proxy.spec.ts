import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

type LoadOptions = {
  allowedEmails: string;
  session: Session;
};

type Session = null | { user: { email: string } };

const loadProxy = async ({ allowedEmails, session }: LoadOptions) => {
  vi.resetModules();

  process.env.ADMIN_ALLOWED_EMAILS = allowedEmails;

  vi.doMock("@/server/better-auth", () => ({
    auth: {
      api: {
        getSession: vi.fn().mockResolvedValue(session),
      },
    },
  }));

  const mod = await import("./proxy");
  return mod.default;
};

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.ADMIN_ALLOWED_EMAILS;
});

describe("proxy", () => {
  it("redirects allowed users from /sign-in to home", async () => {
    const proxy = await loadProxy({
      allowedEmails: "allowed@example.com",
      session: { user: { email: "allowed@example.com" } },
    });

    const request = new NextRequest("https://example.com/sign-in");
    const response = await proxy(request);

    expect(response.headers.get("location")).toBe("https://example.com/");
  });

  it("redirects unauthenticated users to /sign-in", async () => {
    const proxy = await loadProxy({
      allowedEmails: "allowed@example.com",
      session: null,
    });

    const request = new NextRequest("https://example.com/dashboard");
    const response = await proxy(request);

    expect(response.headers.get("location")).toBe(
      "https://example.com/sign-in",
    );
  });

  it("redirects forbidden users to /sign-in", async () => {
    const proxy = await loadProxy({
      allowedEmails: "allowed@example.com",
      session: { user: { email: "blocked@example.com" } },
    });

    const request = new NextRequest("https://example.com/dashboard");
    const response = await proxy(request);

    expect(response.headers.get("location")).toBe(
      "https://example.com/sign-in",
    );
  });
});

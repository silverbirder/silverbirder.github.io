import { describe, expect, it, vi } from "vitest";

const loadModule = async (allowedEmails: string) => {
  vi.resetModules();

  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });

  vi.doMock("@/env", () => ({
    env: { ADMIN_ALLOWED_EMAILS: allowedEmails },
  }));

  vi.doMock("next/navigation", () => ({
    redirect,
  }));

  const mod = await import("./sign-in-access");

  return {
    redirect,
    ...mod,
  };
};

describe("sign-in access helpers", () => {
  it("redirects when the user is allowed", async () => {
    const { redirect, redirectIfAllowed } = await loadModule(
      "allowed@example.com",
    );

    try {
      await redirectIfAllowed({ user: { email: "allowed@example.com" } });
    } catch {
      // redirect throws to halt rendering
    }

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("does not redirect when the user is not allowed", async () => {
    const { redirect, redirectIfAllowed } = await loadModule(
      "allowed@example.com",
    );

    const result = await redirectIfAllowed({
      user: { email: "blocked@example.com" },
    });

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({
      allowedEmails: ["allowed@example.com"],
      isAllowed: false,
    });
  });

  it("returns allowed emails even when session is missing", async () => {
    const { redirect, redirectIfAllowed } = await loadModule(
      "allowed@example.com,other@example.com",
    );

    const result = await redirectIfAllowed(null);

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toEqual({
      allowedEmails: ["allowed@example.com", "other@example.com"],
      isAllowed: false,
    });
  });
});

import { describe, expect, it, vi } from "vitest";

const loadAction = async () => {
  vi.resetModules();

  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });
  const headersMock = vi.fn().mockResolvedValue(new Headers());
  const signOut = vi.fn();

  vi.doMock("next/headers", () => ({
    headers: headersMock,
  }));

  vi.doMock("next/navigation", () => ({
    redirect,
  }));

  vi.doMock("@/server/better-auth", () => ({
    auth: {
      api: {
        signOut,
      },
    },
  }));

  const mod = await import("./sign-out");

  return {
    handleSignOut: mod.handleSignOut,
    headersMock,
    redirect,
    signOut,
  };
};

describe("handleSignOut", () => {
  it("signs out and redirects to sign-in", async () => {
    const { handleSignOut, headersMock, redirect, signOut } =
      await loadAction();

    try {
      await handleSignOut();
    } catch {
      // redirect throws to halt the server action
    }

    expect(headersMock).toHaveBeenCalledOnce();
    expect(signOut).toHaveBeenCalledWith({
      headers: expect.any(Headers),
    });
    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});

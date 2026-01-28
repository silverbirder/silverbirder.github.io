import { describe, expect, it, vi } from "vitest";

const loadAction = async () => {
  vi.resetModules();

  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });
  const signInSocial = vi
    .fn()
    .mockResolvedValue({ url: "https://example.com" });

  vi.doMock("next/navigation", () => ({
    redirect,
  }));

  vi.doMock("@/server/better-auth", () => ({
    auth: {
      api: {
        signInSocial,
      },
    },
  }));

  const mod = await import("./sign-in");

  return {
    handleSignIn: mod.handleSignIn,
    redirect,
    signInSocial,
  };
};

describe("handleSignIn", () => {
  it("signs in with GitHub and redirects", async () => {
    const { handleSignIn, redirect, signInSocial } = await loadAction();

    try {
      await handleSignIn();
    } catch {
      // redirect throws to halt the server action
    }

    expect(signInSocial).toHaveBeenCalledWith({
      body: {
        callbackURL: "/",
        provider: "github",
      },
    });
    expect(redirect).toHaveBeenCalledWith("https://example.com");
  });
});

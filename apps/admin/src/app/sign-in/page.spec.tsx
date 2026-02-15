import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

type Loaded = {
  getCapturedProps: () => null | Record<string, unknown>;
  Page: () => Promise<React.ReactElement>;
  redirect: ReturnType<typeof vi.fn>;
};

type LoadOptions = {
  allowedEmails: string;
  session: Session;
};

type Session = null | { user: SessionUser };

type SessionUser = { email: string; name?: string };

const loadPage = async ({
  allowedEmails,
  session,
}: LoadOptions): Promise<Loaded> => {
  vi.resetModules();

  let capturedProps: null | Record<string, unknown> = null;
  const redirect = vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  });

  vi.doMock("@/env", () => ({
    env: { ADMIN_ALLOWED_EMAILS: allowedEmails },
  }));

  vi.doMock("@/server/better-auth/server", () => ({
    getSession: vi.fn().mockResolvedValue(session),
  }));

  vi.doMock("next/navigation", () => ({
    redirect,
  }));

  vi.doMock("@/app/actions", async () => {
    const actual = await vi.importActual<
      typeof import("@/app/actions/sign-in-access")
    >("@/app/actions/sign-in-access");
    return {
      handleSignIn: vi.fn(),
      handleSignOut: vi.fn(),
      redirectIfAllowed: actual.redirectIfAllowed,
    };
  });

  vi.doMock("@repo/admin-feature-sign-in", () => ({
    SignIn: (props: Record<string, unknown>) => {
      capturedProps = props;
      return React.createElement("div", { "data-testid": "sign-in" });
    },
  }));

  const mod = await import("./page");

  return {
    getCapturedProps: () => capturedProps,
    Page: mod.default,
    redirect,
  };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("SignInPage", () => {
  it("redirects to home when the user is allowed", async () => {
    const { Page, redirect } = await loadPage({
      allowedEmails: "allowed@example.com",
      session: { user: { email: "allowed@example.com" } },
    });

    try {
      await Page();
    } catch {
      // redirect throws to halt rendering
    }

    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("passes sign-out action when user is not allowed", async () => {
    const { getCapturedProps, Page, redirect } = await loadPage({
      allowedEmails: "allowed@example.com",
      session: { user: { email: "blocked@example.com" } },
    });

    const element = await Page();
    renderToStaticMarkup(element);

    expect(redirect).not.toHaveBeenCalled();

    const props = getCapturedProps();
    expect(typeof props?.onSignOut).toBe("function");
  });

  it("does not pass sign-out action when no session exists", async () => {
    const { getCapturedProps, Page, redirect } = await loadPage({
      allowedEmails: "allowed@example.com",
      session: null,
    });

    const element = await Page();
    renderToStaticMarkup(element);

    expect(redirect).not.toHaveBeenCalled();

    const props = getCapturedProps();
    expect(props?.onSignOut).toBeUndefined();
  });
});

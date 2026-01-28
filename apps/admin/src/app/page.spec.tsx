import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

type Session = null | { user: SessionUser };

type SessionUser = { email?: string; name?: string };

const renderHome = async (session: Session) => {
  vi.resetModules();
  const listPosts = vi.fn().mockResolvedValue(["2025-01-01-first-post.md"]);

  vi.doMock("@/server/better-auth/server", () => ({
    getSession: vi.fn().mockResolvedValue(session),
  }));

  vi.doMock("@/server/better-auth", () => ({
    auth: {
      api: {
        signOut: vi.fn(),
      },
    },
  }));

  vi.doMock("@/trpc/server", () => ({
    api: {
      github: {
        list: listPosts,
      },
    },
    HydrateClient: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  }));

  vi.doMock("@repo/admin-feature-top", () => ({
    Top: ({ name, posts }: { name?: null | string; posts: string[] }) =>
      React.createElement("div", {
        "data-name": name ?? "",
        "data-posts": posts.join(","),
        "data-testid": "top",
      }),
  }));

  vi.doMock("next/headers", () => ({
    headers: vi.fn().mockResolvedValue(new Headers()),
  }));

  vi.doMock("next/navigation", () => ({
    redirect: vi.fn(),
  }));

  const mod = await import("./page");
  const element = await mod.default();
  return renderToStaticMarkup(element);
};

describe("Home page", () => {
  it("passes the user name to the feature component", async () => {
    const markup = await renderHome({ user: { name: "Sora" } });

    expect(markup).toContain('data-testid="top"');
    expect(markup).toContain('data-name="Sora"');
  });

  it("passes an empty name when name and email are missing", async () => {
    const markup = await renderHome({ user: {} });

    expect(markup).toContain('data-name=""');
  });

  it("passes the fetched posts to the feature component", async () => {
    const markup = await renderHome({ user: { name: "Sora" } });

    expect(markup).toContain('data-posts="2025-01-01-first-post.md"');
  });
});

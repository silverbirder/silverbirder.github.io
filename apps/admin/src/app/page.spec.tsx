import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const renderHome = async () => {
  vi.resetModules();

  vi.doMock("@repo/admin-feature-top", () => ({
    Top: () =>
      React.createElement("div", {
        "data-testid": "top",
      }),
  }));
  vi.doMock("@/app/actions", () => ({
    deletePostDraft: vi.fn(),
  }));
  vi.doMock("@/trpc/server", () => ({
    api: {
      draft: {
        list: vi.fn().mockResolvedValue([]),
      },
    },
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
  it("renders the top feature component", async () => {
    const markup = await renderHome();

    expect(markup).toContain('data-testid="top"');
  });
});

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const renderLayout = async () => {
  vi.resetModules();

  vi.doMock("@repo/ui", () => ({
    Provider: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "ui-provider" }, children),
  }));

  vi.doMock("@/trpc/react", () => ({
    TRPCReactProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "trpc-provider" }, children),
  }));

  vi.doMock("next-intl/server", () => ({
    getMessages: vi.fn().mockResolvedValue({}),
  }));

  vi.doMock("next-intl", () => ({
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", { "data-testid": "intl-provider" }, children),
  }));

  vi.doMock("next/font/google", () => ({
    Noto_Sans_JP: () => ({ className: "font-class" }),
  }));

  const mod = await import("./layout");
  const element = await mod.default({
    children: React.createElement("span", null, "Child"),
  });
  return renderToStaticMarkup(element);
};

describe("RootLayout", () => {
  it("wraps children with providers", async () => {
    const markup = await renderLayout();

    expect(markup).toContain('data-testid="ui-provider"');
    expect(markup).toContain('data-testid="trpc-provider"');
    expect(markup).toContain('data-testid="intl-provider"');
    expect(markup).toContain("Child");
  });
});

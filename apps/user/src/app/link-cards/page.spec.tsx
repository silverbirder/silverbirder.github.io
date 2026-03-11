import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const renderPage = async () => {
  vi.resetModules();

  vi.doMock("@repo/user-feature-link-cards", () => ({
    LinkCards: (props: {
      cards?: Array<{ title: string; url: string }>;
      description: string;
      empty: string;
      title: string;
    }) =>
      React.createElement("div", {
        "data-cards": String(props.cards?.length ?? 0),
        "data-description": props.description,
        "data-empty": props.empty,
        "data-testid": "user-link-cards-feature",
        "data-title": props.title,
      }),
  }));

  vi.doMock("@repo/metadata", () => ({
    siteName: "silverbirder",
  }));

  vi.doMock("next-intl/server", () => ({
    getTranslations: async () => (key: string, values?: { count?: number }) => {
      if (key === "description") {
        return `${values?.count ?? 0} 件のリンクカードを確認できます。`;
      }
      if (key === "empty") {
        return "リンクカードはまだありません。";
      }
      return "リンクカード一覧";
    },
  }));

  vi.doMock("@repo/util", async () => {
    const actual = await vi.importActual<object>("@repo/util");
    return {
      ...actual,
      buildSiteUrl: (value: string) =>
        `https://silverbirder.github.io/${value}`,
    };
  });

  vi.doMock("@/libs/link-card-list", () => ({
    listLinkCards: vi.fn().mockResolvedValue([
      {
        description: "Description",
        faviconSrc: "/link-card/github.ico",
        siteName: "GitHub",
        thumbnailSrc: "/link-card/repo.png",
        title: "Repo",
        url: "https://github.com/silverbirder/example",
      },
    ]),
  }));

  const mod = await import("./page");
  const element = await mod.default();
  return {
    markup: renderToStaticMarkup(element),
    metadata: mod.metadata,
  };
};

describe("LinkCards page", () => {
  it("renders the link cards feature", async () => {
    const { markup } = await renderPage();

    expect(markup).toContain('data-testid="user-link-cards-feature"');
    expect(markup).toContain('data-cards="1"');
    expect(markup).toContain("1 件のリンクカードを確認できます。");
  });

  it("defines noindex metadata", async () => {
    const { metadata } = await renderPage();

    expect(metadata).toEqual(
      expect.objectContaining({
        robots: { index: false },
        title: "リンクカード一覧",
      }),
    );
  });
});

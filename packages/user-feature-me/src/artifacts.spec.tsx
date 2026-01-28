import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    alt,
    src,
    ...props
  }: {
    alt?: string;
    src: string | { src: string };
  }) => {
    const resolvedSrc = typeof src === "string" ? src : src.src;
    return <img alt={alt} src={resolvedSrc} {...props} />;
  },
}));

import { ArtifactsSection } from "./artifacts";
import * as stories from "./artifacts.stories";
import { renderWithProvider } from "./test-util";

const Stories = composeStories(stories);

describe("ArtifactsSection", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders section headings", async () => {
    await renderWithProvider(<ArtifactsSection />);

    const textContent = document.body.textContent ?? "";
    expect(textContent).toContain("成果物");
    expect(textContent).toContain("書籍");
    expect(textContent).toContain("Webサービス");
    expect(textContent).toContain("GitHubプロジェクト");
    expect(textContent).toContain("過去の活動履歴");
  });

  it("renders artifacts content", async () => {
    await renderWithProvider(<ArtifactsSection />);

    const textContent = document.body.textContent ?? "";
    expect(textContent).toContain("はじめてのWeb Components入門");
    expect(textContent).toContain("個人開発で開発したWebサービス一覧");
    expect(textContent).toContain("o-embed");
    expect(textContent).toContain(
      "大規模フロントエンドのクリーンアーキテクチャ化",
    );
  });
});

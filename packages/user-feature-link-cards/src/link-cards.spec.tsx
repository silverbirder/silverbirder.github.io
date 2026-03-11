import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { LinkCards } from "./link-cards";
import * as stories from "./link-cards.stories";
import { renderWithProvider } from "./test-util";

const Stories = composeStories(stories);

describe("LinkCards", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders provided cards", async () => {
    await renderWithProvider(
      <LinkCards
        cards={[
          {
            description: "Description",
            faviconSrc: "/link-card/favicon.ico",
            siteName: "Example",
            thumbnailSrc: "/link-card/thumbnail.png",
            title: "Example title",
            url: "https://example.com/article",
          },
        ]}
        description="1 件のリンクカードを確認できます。"
        empty="リンクカードはまだありません。"
        title="リンクカード一覧"
      />,
    );

    expect(document.body.textContent ?? "").toContain("リンクカード一覧");
    expect(document.body.textContent ?? "").toContain("Example title");
    expect(document.body.textContent ?? "").toContain(
      "https://example.com/article",
    );
  });
});

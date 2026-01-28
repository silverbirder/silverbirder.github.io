import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonHatena } from "./share-button-hatena";
import * as stories from "./share-button-hatena.stories";

const Stories = composeStories(stories);

describe("ShareButtonHatena", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("builds share url for Hatena", async () => {
    const url = "https://example.com/blog/contents/test/";
    const text = "Notebook Prose";
    const { container } = await renderWithProvider(
      <ShareButtonHatena label="はてなでシェア" text={text} url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      `https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(
        url,
      )}&btitle=${encodeURIComponent(text)}`,
    );
  });
});

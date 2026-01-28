import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonX } from "./share-button-x";
import * as stories from "./share-button-x.stories";

const Stories = composeStories(stories);

describe("ShareButtonX", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("builds share url for X", async () => {
    const url = "https://example.com/blog/contents/test/";
    const text = "Notebook Prose";
    const { container } = await renderWithProvider(
      <ShareButtonX label="Xでシェア" text={text} url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(url)}`,
    );
  });
});

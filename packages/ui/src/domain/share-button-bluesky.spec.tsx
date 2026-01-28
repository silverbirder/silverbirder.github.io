import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonBluesky } from "./share-button-bluesky";
import * as stories from "./share-button-bluesky.stories";

const Stories = composeStories(stories);

describe("ShareButtonBluesky", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("builds share url for Bluesky", async () => {
    const url = "https://example.com/blog/contents/test/";
    const text = "Notebook Prose";
    const { container } = await renderWithProvider(
      <ShareButtonBluesky label="Blueskyでシェア" text={text} url={url} />,
    );

    const link = container.querySelector("a");
    const composedText = `${text} ${url}`;
    expect(link?.getAttribute("href")).toBe(
      `https://bsky.app/intent/compose?text=${encodeURIComponent(
        composedText,
      )}`,
    );
  });
});

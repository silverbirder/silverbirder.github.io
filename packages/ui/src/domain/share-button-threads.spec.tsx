import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonThreads } from "./share-button-threads";
import * as stories from "./share-button-threads.stories";

const Stories = composeStories(stories);

describe("ShareButtonThreads", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("builds share url for Threads", async () => {
    const url = "https://example.com/blog/contents/test/";
    const text = "Notebook Prose";
    const { container } = await renderWithProvider(
      <ShareButtonThreads label="Threadsでシェア" text={text} url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      `https://www.threads.net/intent/post?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(url)}`,
    );
  });
});

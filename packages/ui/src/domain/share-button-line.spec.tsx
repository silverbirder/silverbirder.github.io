import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonLine } from "./share-button-line";
import * as stories from "./share-button-line.stories";

const Stories = composeStories(stories);

describe("ShareButtonLine", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("builds share url for LINE", async () => {
    const url = "https://example.com/blog/contents/test/";
    const { container } = await renderWithProvider(
      <ShareButtonLine label="LINEでシェア" text="" url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        url,
      )}`,
    );
  });
});

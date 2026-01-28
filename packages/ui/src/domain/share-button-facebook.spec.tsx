import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonFacebook } from "./share-button-facebook";
import * as stories from "./share-button-facebook.stories";

const Stories = composeStories(stories);

describe("ShareButtonFacebook", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("builds share url for Facebook", async () => {
    const url = "https://example.com/blog/contents/test/";
    const { container } = await renderWithProvider(
      <ShareButtonFacebook label="Facebookでシェア" text="" url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    );
  });
});

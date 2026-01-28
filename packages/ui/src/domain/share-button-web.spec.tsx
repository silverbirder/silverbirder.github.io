import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonWeb } from "./share-button-web";
import * as stories from "./share-button-web.stories";

const Stories = composeStories(stories);

const setShare = (share: (data: ShareData) => Promise<void>) => {
  Object.defineProperty(navigator, "share", {
    configurable: true,
    value: share,
  });
};

describe("ShareButtonWeb", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("calls web share api on click", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    setShare(share);

    const url = "https://example.com/blog/contents/test/";
    const text = "Notebook Prose";
    const { container } = await renderWithProvider(
      <ShareButtonWeb label="デバイスで共有" text={text} url={url} />,
    );

    const button = container.querySelector("button");
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    await Promise.resolve();

    expect(share).toHaveBeenCalledWith({ text, url });
  });
});

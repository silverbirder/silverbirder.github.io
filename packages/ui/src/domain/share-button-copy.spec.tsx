import { composeStories } from "@storybook/nextjs-vite";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { ShareButtonCopy } from "./share-button-copy";
import * as stories from "./share-button-copy.stories";

const Stories = composeStories(stories);

const setClipboard = (writeText: (value: string) => Promise<void>) => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
};

describe("ShareButtonCopy", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("calls clipboard api on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    const url = "https://example.com/blog/contents/test/";
    const { container } = await renderWithProvider(
      <ShareButtonCopy
        copiedLabel="コピーしました"
        label="リンクをコピー"
        url={url}
      />,
    );

    const button = container.querySelector("button");
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(writeText).toHaveBeenCalledWith(url);
  });

  it("shows tooltip state after copy and hides it after timeout", async () => {
    vi.useFakeTimers();

    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    const url = "https://example.com/blog/contents/test/";
    const { container } = await renderWithProvider(
      <ShareButtonCopy
        copiedLabel="コピーしました"
        label="リンクをコピー"
        url={url}
      />,
    );

    const button = container.querySelector("button");
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(writeText).toHaveBeenCalledWith(url);

    const clipboardPromise = writeText.mock.results[0]?.value;
    if (clipboardPromise) {
      await clipboardPromise;
    }
    await Promise.resolve();

    expect(button?.getAttribute("data-copied")).toBe("true");

    vi.advanceTimersByTime(2000);
    await Promise.resolve();

    expect(button?.getAttribute("data-copied")).toBe("false");
  });
});

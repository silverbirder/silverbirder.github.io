import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { RssButton } from "./rss-button";
import * as stories from "./rss-button.stories";

const Stories = composeStories(stories);

describe("RssButton", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders rss url as link href", async () => {
    const url = "https://example.com/rss.xml";
    const { container } = await renderWithProvider(
      <RssButton label="RSSをフォロー" url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(url);
  });
});

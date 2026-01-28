import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ViewTransitionLink } from "./view-transition-link";
import * as stories from "./view-transition-link.stories";

const Stories = composeStories(stories);

describe("ViewTransitionLink", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders an anchor with href and children", async () => {
    const { container } = await renderWithProvider(
      <ViewTransitionLink href="/blog">Go</ViewTransitionLink>,
    );

    const link = container.querySelector("a");
    expect(link?.textContent).toBe("Go");
    expect(link?.getAttribute("href")).toBe("/blog/");
  });
});

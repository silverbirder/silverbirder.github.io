import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ScrollProgressBar } from "./scroll-progress-bar";
import * as stories from "./scroll-progress-bar.stories";

const Stories = composeStories(stories);

describe("ScrollProgressBar", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders progress bar element", async () => {
    const { container } = await renderWithProvider(
      <ScrollProgressBar position="absolute" />,
    );

    expect(
      container.querySelector('[data-testid="scroll-progress-bar"]'),
    ).not.toBeNull();
  });
});

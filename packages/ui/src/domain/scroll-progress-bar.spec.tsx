import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { ScrollProgressBar } from "./scroll-progress-bar";
import * as stories from "./scroll-progress-bar.stories";

const Stories = composeStories(stories);

describe("ScrollProgressBar", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;
    const styleTag = document.createElement("style");
    styleTag.dataset.testid = "scroll-progress-bar-test-style";
    styleTag.textContent = `
      .scroll-progress-bar {
        animation: none !important;
        animation-timeline: none !important;
        scale: 1 1 !important;
      }
    `;
    document.head.appendChild(styleTag);

    try {
      await Story.run();

      await expect(document.body).toMatchScreenshot();
    } finally {
      document.body.innerHTML = originalInnerHtml;
      styleTag.remove();
    }
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

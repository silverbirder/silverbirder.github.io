import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { PaperStack } from "./paper-stack";
import * as stories from "./paper-stack.stories";

const Stories = composeStories(stories);

describe("PaperStack", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the specified number of paper layers", async () => {
    const { container } = await renderWithProvider(<PaperStack count={7} />);

    const layers = container.querySelectorAll('[data-testid="paper-layer"]');
    expect(layers).toHaveLength(7);
  });

  it("renders short-side-aligned lines inside each paper layer", async () => {
    const { container } = await renderWithProvider(<PaperStack count={2} />);

    const lines = container.querySelectorAll('[data-testid="paper-line"]');
    expect(lines).toHaveLength(16);
  });

  it("does not render paper layers for zero or negative counts", async () => {
    const { container: zeroCountContainer } = await renderWithProvider(
      <PaperStack count={0} />,
    );
    const { container: negativeCountContainer } = await renderWithProvider(
      <PaperStack count={-3} />,
    );

    const zeroLayers = zeroCountContainer.querySelectorAll(
      '[data-testid="paper-layer"]',
    );
    const negativeLayers = negativeCountContainer.querySelectorAll(
      '[data-testid="paper-layer"]',
    );

    expect(zeroLayers).toHaveLength(0);
    expect(negativeLayers).toHaveLength(0);
  });
});

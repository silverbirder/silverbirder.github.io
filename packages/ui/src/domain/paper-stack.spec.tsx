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
    expect(lines).toHaveLength(12);
  });

  it("renders paper layers for valid range counts (1 to 10)", async () => {
    const { container: minContainer } = await renderWithProvider(
      <PaperStack count={1} />,
    );
    const { container: maxContainer } = await renderWithProvider(
      <PaperStack count={10} />,
    );

    const minLayers = minContainer.querySelectorAll(
      '[data-testid="paper-layer"]',
    );
    const maxLayers = maxContainer.querySelectorAll(
      '[data-testid="paper-layer"]',
    );

    expect(minLayers).toHaveLength(1);
    expect(maxLayers).toHaveLength(10);
  });

  it("keeps the same viewBox scale between one and ten papers", async () => {
    const { container: singleContainer } = await renderWithProvider(
      <PaperStack count={1} />,
    );
    const { container: tenContainer } = await renderWithProvider(
      <PaperStack count={10} />,
    );
    const singleSvg = singleContainer.querySelector("svg");
    const tenSvg = tenContainer.querySelector("svg");

    expect(singleSvg?.getAttribute("viewBox")).toBe(
      tenSvg?.getAttribute("viewBox"),
    );
  });

  it("aligns paper stack to the bottom of the viewport", async () => {
    const { container } = await renderWithProvider(<PaperStack count={3} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("preserveAspectRatio")).toBe("xMinYMax meet");
  });
});

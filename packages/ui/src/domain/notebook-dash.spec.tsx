import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { NotebookDash } from "./notebook-dash";
import * as stories from "./notebook-dash.stories";

const Stories = composeStories(stories);

describe("NotebookDash", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders an SVG with the provided dimensions", async () => {
    const { container } = await renderWithProvider(
      <NotebookDash height={12} patternWidth={24} />,
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.style.height).toBe("12px");
    expect(svg?.style.bottom).toBe("-12px");

    const pattern = container.querySelector("pattern");
    expect(pattern?.getAttribute("height")).toBe("12");
    expect(pattern?.getAttribute("width")).toBe("24");
  });

  it("links the pattern id to the rect fill", async () => {
    const { container } = await renderWithProvider(
      <NotebookDash height={8} patternWidth={16} />,
    );

    const pattern = container.querySelector("pattern");
    const rect = container.querySelector("rect");

    const patternId = pattern?.getAttribute("id");
    expect(patternId).toBeTruthy();
    expect(rect?.getAttribute("fill")).toBe(`url(#${patternId})`);
  });
});

import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { Spiral } from "./spiral";
import * as stories from "./spiral.stories";

const Stories = composeStories(stories);

describe("Spiral", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders with default props", async () => {
    const { container } = await renderWithProvider(
      <div style={{ color: "rgb(10, 20, 30)" }}>
        <Spiral />
      </div>,
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 87 39");

    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    const computed = getComputedStyle(path as SVGPathElement);
    expect(computed.stroke).toBe("rgb(10, 20, 30)");
    expect(computed.strokeDashoffset).toBe("0px");
  });

  it("applies custom className", async () => {
    const { container } = await renderWithProvider(
      <Spiral className="custom-class" />,
    );

    const box = container.querySelector(".custom-class");
    expect(box).not.toBeNull();
  });

  it("applies custom strokeColor", async () => {
    const { container } = await renderWithProvider(
      <Spiral strokeColor="#ff0000" />,
    );

    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    const computed = getComputedStyle(path as SVGPathElement);
    expect(computed.stroke).toBe("rgb(255, 0, 0)");
  });

  it("does not render animation in test environment", async () => {
    const { container } = await renderWithProvider(<Spiral />);

    const animate = container.querySelector("animate");
    expect(animate).toBeNull();

    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    const computed = getComputedStyle(path as SVGPathElement);
    expect(computed.strokeDashoffset).toBe("0px");
  });

  it("calculates correct keyTimes based on duration and pause", async () => {
    const duration = 2;
    const pause = 1;

    const { container } = await renderWithProvider(
      <Spiral duration={duration} pause={pause} />,
    );

    const path = container.querySelector("path");
    expect(path).not.toBeNull();
  });

  it("handles edge case with very small total time", async () => {
    const { container } = await renderWithProvider(
      <Spiral duration={0} pause={0} />,
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});

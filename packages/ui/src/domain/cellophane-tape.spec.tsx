import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { CellophaneTape } from "./cellophane-tape";
import * as stories from "./cellophane-tape.stories";

const Stories = composeStories(stories);

describe("CellophaneTape", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders a decorative svg", async () => {
    const { container } = await renderWithProvider(<CellophaneTape />);

    const tape = container.querySelector('[data-testid="cellophane-tape"]');
    expect(tape?.getAttribute("aria-hidden")).toBe("true");
  });
});

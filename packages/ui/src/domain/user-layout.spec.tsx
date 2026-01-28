import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import * as stories from "./user-layout.stories";

const Stories = composeStories(stories);

describe("UserLayout", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders children", async () => {
    await renderWithProvider(<Stories.Ideal />);

    expect(document.body.textContent ?? "").toContain("Centered Layout");
  });
});

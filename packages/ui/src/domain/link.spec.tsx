import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { Link } from "./link";
import * as stories from "./link.stories";

const Stories = composeStories(stories);

describe("Link", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("does not add external icon for internal links", async () => {
    const { container } = await renderWithProvider(
      <Link href="/blog">Internal</Link>,
    );

    const icon = container.querySelector("svg");
    expect(icon).toBeNull();
  });

  it("adds external icon for different origin links", async () => {
    const { container } = await renderWithProvider(
      <Link href="https://example.com">External</Link>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    const icon = container.querySelector("svg");
    expect(icon).not.toBeNull();
  });
});

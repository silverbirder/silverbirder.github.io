import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { RobotBadge } from "./robot-badge";
import * as stories from "./robot-badge.stories";

const Stories = composeStories(stories);

describe("RobotBadge", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("marks the badge as aria-hidden", async () => {
    const { container } = await renderWithProvider(
      <RobotBadge boxSize="24px" status="index" />,
    );

    const root = container.querySelector('[aria-hidden="true"]');
    expect(root).not.toBeNull();
  });

  it("stores index status on the badge", async () => {
    const { container } = await renderWithProvider(
      <RobotBadge boxSize="24px" status="noindex" />,
    );

    const badge = container.querySelector("[data-index-status]");
    expect(badge?.getAttribute("data-index-status")).toBe("noindex");
  });
});

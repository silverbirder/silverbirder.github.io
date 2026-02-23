import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { FollowItButton } from "./follow-it-button";
import * as stories from "./follow-it-button.stories";

const Stories = composeStories(stories);

describe("FollowItButton", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders follow.it url as link href", async () => {
    const url = "https://follow.it/qxug4e?leanpub";
    const { container } = await renderWithProvider(
      <FollowItButton label="メール通知を受け取る" url={url} />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe(url);
  });
});

import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { NotebookLike } from "./notebook-like";
import * as stories from "./notebook-like.stories";

const Stories = composeStories(stories);

describe("NotebookLike", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders a button and count label", async () => {
    const { container } = await renderWithProvider(
      <NotebookLike
        disableAutoLoad
        initialCount={3}
        name="sample-post"
        namespace="silverbirder-github-io"
      />,
    );

    const button = container.querySelector(
      'button[aria-label="この記事にいいねする"]',
    );
    const bodyText = container.textContent ?? "";

    expect(button).not.toBeNull();
    expect(bodyText).toContain("3");
  });
});

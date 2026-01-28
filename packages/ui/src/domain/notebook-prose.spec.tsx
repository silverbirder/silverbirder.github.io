import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { NotebookProse } from "./notebook-prose";
import * as stories from "./notebook-prose.stories";

const Stories = composeStories(stories);

describe("NotebookProse", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders children", async () => {
    const { container } = await renderWithProvider(
      <NotebookProse>
        <h2>Heading</h2>
        <p>Body copy.</p>
      </NotebookProse>,
    );

    expect(container.querySelector("h2")?.textContent).toBe("Heading");
    expect(container.querySelector("p")?.textContent).toBe("Body copy.");
  });
});

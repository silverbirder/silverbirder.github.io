import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { SkillsSection } from "./skills-section";
import * as stories from "./skills-section.stories";
import { renderWithProvider } from "./test-util";

const Stories = composeStories(stories);

describe("SkillsSection", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders section content", async () => {
    await renderWithProvider(<SkillsSection />);

    const textContent = document.body.textContent ?? "";
    expect(textContent).toContain("お気に入りの技術");
    expect(textContent).toContain("React");
  });
});

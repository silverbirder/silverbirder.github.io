import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "./test-util";
import { WorkExperienceTimeline } from "./work-experience-timeline";
import * as stories from "./work-experience-timeline.stories";

const Stories = composeStories(stories);

describe("WorkExperienceTimeline", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the heading and legend labels", async () => {
    await renderWithProvider(<WorkExperienceTimeline />);

    const textContent = document.body.textContent ?? "";
    expect(textContent).toContain("職歴");
    expect(textContent).toContain("正社員");
    expect(textContent).toContain("業務委託");
  });

  it("lists the work experience companies", async () => {
    await renderWithProvider(<WorkExperienceTimeline />);

    const textContent = document.body.textContent ?? "";
    expect(textContent).toContain("System Integration");
    expect(textContent).toContain("E-Commerce");
    expect(textContent).toContain("Fintech");
    expect(textContent).toContain("Restaurant");
    expect(textContent).toContain("Food Delivery");
    expect(textContent).toContain("Media");
  });
});

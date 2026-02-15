import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "./test-util";
import { Top } from "./top";
import * as stories from "./top.stories";

const Stories = composeStories(stories);

describe("Top", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the notebook copy and children", async () => {
    const blogSummary = {
      latestPublishedAt: "2026-01-27",
      streakDays: 3,
      totalCount: 123,
    };
    await renderWithProvider(
      <Top
        blogSummary={blogSummary}
        timelineItems={[
          {
            compiledSource: "",
            date: "2026-01-26",
            key: "timeline-1",
            type: "bookmark",
          },
        ]}
      />,
    );

    const textContent = document.body.textContent ?? "";
    expect(textContent).toContain("ようこそ、silverbirder のジブンノートへ！");
    expect(textContent).toContain("初めての方");
    expect(textContent).toContain("自己紹介");
    expect(textContent).toContain("読者の方");
    expect(textContent).toContain("ブログ");
    expect(textContent).toContain("最新更新: 2026-01-27");
    expect(textContent).toContain("記事数: 123");
    expect(textContent).toContain("連続投稿日数: 3日");
    expect(textContent).toContain("タイムライン");
    expect(textContent).toContain("2026-01-26");
    expect(textContent).toContain("その他");
    expect(textContent).toContain("機能リクエストへ");

    const featureRequestLink = document.querySelector(
      'a[href="https://fequest.vercel.app/9"]',
    );
    expect(featureRequestLink).not.toBeNull();
  });

  it("splits paper stacks into groups of ten and remainder", async () => {
    await renderWithProvider(
      <Top
        blogSummary={{
          latestPublishedAt: "2026-01-27",
          streakDays: 3,
          totalCount: 11,
        }}
      />,
    );

    const fullStack = document.querySelector('[data-paper-stack-count="10"]');
    const partialStack = document.querySelector('[data-paper-stack-count="1"]');
    const paperStacks = document.querySelectorAll("[data-paper-stack-count]");

    expect(fullStack).not.toBeNull();
    expect(partialStack).not.toBeNull();
    expect(paperStacks).toHaveLength(2);
  });
});

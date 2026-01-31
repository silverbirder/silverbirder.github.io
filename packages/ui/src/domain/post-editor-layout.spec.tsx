import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { PostEditorLayout } from "./post-editor-layout";
import * as stories from "./post-editor-layout.stories";

const Stories = composeStories(stories);

describe("PostEditorLayout", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders labels and preview state", async () => {
    await renderWithProvider(
      <PostEditorLayout
        bodyValue=""
        indexValue={false}
        onBodyChange={() => undefined}
        onIndexChange={() => undefined}
        onPublishedAtChange={() => undefined}
        onSummaryChange={() => undefined}
        onTagInputBlur={() => undefined}
        onTagInputChange={() => undefined}
        onTagInputKeyDown={() => undefined}
        onTagRemove={() => undefined}
        onTagSuggestionClick={() => undefined}
        onTitleChange={() => undefined}
        previewContent={<p>Preview</p>}
        previewIsLoading
        publishedAtValue="2026-01-29"
        summaryValue=""
        tagInputValue=""
        tagSuggestions={[]}
        tagsValue={[]}
        titleValue="Release notes"
      />,
    );

    const heading = document.querySelector("h1");
    const labels = Array.from(document.querySelectorAll("label")).map(
      (label) => label.textContent ?? "",
    );
    const preview = document.querySelector(
      "[data-testid='post-editor-preview']",
    );

    expect(heading?.textContent ?? "").toContain("ブログ");
    expect(labels.some((label) => label.includes("タイトル"))).toBe(true);
    expect(labels.some((label) => label.includes("公開日"))).toBe(true);
    expect(labels.some((label) => label.includes("検索インデックス"))).toBe(
      true,
    );
    expect(labels.some((label) => label.includes("サマリー"))).toBe(true);
    expect(labels.some((label) => label.includes("タグ"))).toBe(true);
    expect(labels.some((label) => label.includes("本文"))).toBe(true);
    expect(preview?.textContent ?? "").toContain("Preview");
  });
});

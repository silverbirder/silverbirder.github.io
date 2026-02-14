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
        initialTab="preview"
        onBodyChange={() => undefined}
        onPublishedAtChange={() => undefined}
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

    const labels = Array.from(document.querySelectorAll("label")).map(
      (label) => label.textContent ?? "",
    );
    const preview = document.querySelector(
      "[data-testid='post-editor-preview']",
    );
    const drawerTrigger = document.querySelector(
      "[data-testid='post-editor-drawer-trigger']",
    );

    expect(labels.some((label) => label.includes("本文"))).toBe(false);
    expect(preview?.textContent ?? "").toContain("Preview");
    expect(drawerTrigger).not.toBeNull();
  });

  it("renders integration section with Zenn controls", async () => {
    await renderWithProvider(
      <PostEditorLayout
        bodyValue="Body"
        onBodyChange={() => undefined}
        onPublishedAtChange={() => undefined}
        onTagInputBlur={() => undefined}
        onTagInputChange={() => undefined}
        onTagInputKeyDown={() => undefined}
        onTagRemove={() => undefined}
        onTagSuggestionClick={() => undefined}
        onTitleChange={() => undefined}
        onZennEnabledChange={() => undefined}
        onZennTypeChange={() => undefined}
        previewContent={<p>Preview</p>}
        publishedAtValue="2026-01-29"
        summaryValue=""
        tagInputValue=""
        tagSuggestions={[]}
        tagsValue={[]}
        titleValue="Release notes"
        zennEnabledValue
        zennTypeValue="tech"
      />,
    );

    const drawerTrigger = document.querySelector(
      "[data-testid='post-editor-drawer-trigger']",
    );
    drawerTrigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const section = document.querySelector("h3");
    expect(section?.textContent ?? "").toContain("連携");
    const zennCheckbox = document.querySelector(
      "input[name='zennEnabled'][type='checkbox']",
    );
    expect(zennCheckbox).not.toBeNull();
    const zennTypeRadios = document.querySelectorAll(
      "input[name='zennType'][type='radio']",
    );
    expect(zennTypeRadios.length).toBeGreaterThan(0);
  });

  it("renders integration section with Hatena controls", async () => {
    await renderWithProvider(
      <PostEditorLayout
        bodyValue="Body"
        hatenaEnabledValue
        onBodyChange={() => undefined}
        onHatenaEnabledChange={() => undefined}
        onPublishedAtChange={() => undefined}
        onTagInputBlur={() => undefined}
        onTagInputChange={() => undefined}
        onTagInputKeyDown={() => undefined}
        onTagRemove={() => undefined}
        onTagSuggestionClick={() => undefined}
        onTitleChange={() => undefined}
        previewContent={<p>Preview</p>}
        publishedAtValue="2026-01-29"
        summaryValue=""
        tagInputValue=""
        tagSuggestions={[]}
        tagsValue={[]}
        titleValue="Release notes"
      />,
    );

    const drawerTrigger = document.querySelector(
      "[data-testid='post-editor-drawer-trigger']",
    );
    drawerTrigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const section = document.querySelector("h3");
    expect(section?.textContent ?? "").toContain("連携");
    const hatenaCheckbox = document.querySelector(
      "input[name='hatenaEnabled'][type='checkbox']",
    );
    expect(hatenaCheckbox).not.toBeNull();
  });

  it("renders markdownlint action in the drawer", async () => {
    await renderWithProvider(
      <PostEditorLayout
        bodyValue="Body"
        onBodyChange={() => undefined}
        onFixMarkdownLint={() => undefined}
        onPublishedAtChange={() => undefined}
        onTagInputBlur={() => undefined}
        onTagInputChange={() => undefined}
        onTagInputKeyDown={() => undefined}
        onTagRemove={() => undefined}
        onTagSuggestionClick={() => undefined}
        onTitleChange={() => undefined}
        previewContent={<p>Preview</p>}
        publishedAtValue="2026-01-29"
        summaryValue=""
        tagInputValue=""
        tagSuggestions={[]}
        tagsValue={[]}
        titleValue="Release notes"
      />,
    );

    const drawerTrigger = document.querySelector(
      "[data-testid='post-editor-drawer-trigger']",
    );
    drawerTrigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const lintButton = document.querySelector(
      "[data-testid='post-editor-markdownlint-fix']",
    );
    expect(lintButton).not.toBeNull();
  });

  it("renders save draft action in the drawer", async () => {
    await renderWithProvider(
      <PostEditorLayout
        bodyValue="Body"
        onBodyChange={() => undefined}
        onPublishedAtChange={() => undefined}
        onSaveDraft={() => undefined}
        onTagInputBlur={() => undefined}
        onTagInputChange={() => undefined}
        onTagInputKeyDown={() => undefined}
        onTagRemove={() => undefined}
        onTagSuggestionClick={() => undefined}
        onTitleChange={() => undefined}
        previewContent={<p>Preview</p>}
        publishedAtValue="2026-01-29"
        summaryValue=""
        tagInputValue=""
        tagSuggestions={[]}
        tagsValue={[]}
        titleValue="Release notes"
      />,
    );

    const drawerTrigger = document.querySelector(
      "[data-testid='post-editor-drawer-trigger']",
    );
    drawerTrigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const saveButton = document.querySelector(
      "[data-testid='post-editor-save-draft']",
    );
    expect(saveButton).not.toBeNull();
  });
});

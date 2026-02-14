import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostEditorLayout } from "./post-editor-layout";

const meta = {
  args: {
    bodyValue: "## Highlights\n\n- Clear structure\n- Short sections",
    hatenaEnabledValue: true,
    initialTab: "preview",
    onBodyChange: () => undefined,
    onHatenaEnabledChange: () => undefined,
    onPublishedAtChange: () => undefined,
    onResolveLinkTitles: () => undefined,
    onTagInputBlur: () => undefined,
    onTagInputChange: () => undefined,
    onTagInputKeyDown: () => undefined,
    onTagRemove: () => undefined,
    onTagSuggestionClick: () => undefined,
    onTitleChange: () => undefined,
    onZennEnabledChange: () => undefined,
    onZennTypeChange: () => undefined,
    previewContent: (
      <>
        <h2>Highlights</h2>
        <ul>
          <li>Clear structure</li>
          <li>Short sections</li>
        </ul>
      </>
    ),
    previewIsLoading: false,
    previewTags: ["Frontend", "Design"],
    publishedAtValue: "2026-01-29",
    summaryValue:
      "A quick overview of the release notes and improvements shipped this week.",
    tagInputValue: "",
    tagSuggestions: ["Frontend", "Design", "TypeScript", "DevOps"],
    tagsValue: ["Frontend", "Design"],
    titleValue: "Release notes",
    zennEnabledValue: true,
    zennTypeValue: "tech",
  },
  component: PostEditorLayout,
  title: "UI/Domain/PostEditorLayout",
} satisfies Meta<typeof PostEditorLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ideal: Story = {};

export const Empty: Story = {
  args: {
    bodyValue: "",
    initialTab: "input",
    previewContent: null,
    titleValue: "",
  },
};

export const Error: Story = {
  args: {
    initialTab: "preview",
    previewContent: <p role="alert">Failed to load preview</p>,
  },
};

export const Partial: Story = {
  args: {
    bodyValue: "",
    initialTab: "input",
    previewContent: null,
    titleValue: "Draft in progress",
  },
};

export const Loading: Story = {
  args: {
    initialTab: "preview",
    previewContent: <p>Previous preview</p>,
    previewIsLoading: true,
    resolveLinkTitlesIsLoading: true,
  },
};

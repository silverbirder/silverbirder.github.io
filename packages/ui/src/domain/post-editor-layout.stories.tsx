import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostEditorLayout } from "./post-editor-layout";

const meta = {
  args: {
    bodyValue: "## Highlights\n\n- Clear structure\n- Short sections",
    onBodyChange: () => undefined,
    onResolveLinkTitles: () => undefined,
    onTitleChange: () => undefined,
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
    titleValue: "Release notes",
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
    previewContent: null,
    titleValue: "",
  },
};

export const Error: Story = {
  args: {
    previewContent: <p role="alert">Failed to load preview</p>,
  },
};

export const Partial: Story = {
  args: {
    bodyValue: "",
    previewContent: null,
    titleValue: "Draft in progress",
  },
};

export const Loading: Story = {
  args: {
    previewContent: <p>Previous preview</p>,
    previewIsLoading: true,
    resolveLinkTitlesIsLoading: true,
  },
};

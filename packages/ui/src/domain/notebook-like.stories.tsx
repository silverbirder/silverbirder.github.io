import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotebookLike } from "./notebook-like";

const meta = {
  component: NotebookLike,
  title: "UI/Domain/NotebookLike",
} satisfies Meta<typeof NotebookLike>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    name: "example-post",
    namespace: "silverbirder-github-io",
    title: "Example Post",
  },
};

export const Empty: Story = {
  args: {
    name: "empty-post",
    namespace: "silverbirder-github-io",
    title: "Empty Post",
  },
};

export const Error: Story = {
  args: {
    name: "error-post",
    namespace: "silverbirder-github-io",
    title: "Error Post",
  },
};

export const Partial: Story = {
  args: {
    name: "partial-post",
    namespace: "silverbirder-github-io",
    title: "Partial Post",
  },
};

export const Loading: Story = {
  args: {
    name: "loading-post",
    namespace: "silverbirder-github-io",
    title: "Loading Post",
  },
};

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
    disableAutoLoad: true,
    initialCount: 12,
    name: "example-post",
    namespace: "silverbirder-github-io",
  },
};

export const Empty: Story = {
  args: {
    disableAutoLoad: true,
    initialCount: 0,
    name: "empty-post",
    namespace: "silverbirder-github-io",
  },
};

export const Error: Story = {
  args: {
    disableAutoLoad: true,
    initialStatus: "error",
    name: "error-post",
    namespace: "silverbirder-github-io",
  },
};

export const Partial: Story = {
  args: {
    disableAutoLoad: true,
    name: "partial-post",
    namespace: "silverbirder-github-io",
  },
};

export const Loading: Story = {
  args: {
    disableAutoLoad: true,
    initialStatus: "loading",
    name: "loading-post",
    namespace: "silverbirder-github-io",
  },
};

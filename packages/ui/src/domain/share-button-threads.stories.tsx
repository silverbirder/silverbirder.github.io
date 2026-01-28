import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonThreads } from "./share-button-threads";

const meta = {
  component: ShareButtonThreads,
  title: "UI/Domain/ShareButtonThreads",
} satisfies Meta<typeof ShareButtonThreads>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "Threadsでシェア",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Empty: Story = {
  args: {
    label: "",
    text: "",
    url: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    label: "Threadsでシェア",
    text: "Broken URL",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "Threadsでシェア",
    text: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    label: "Threadsでシェア",
    loading: true,
    loadingText: "準備中",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

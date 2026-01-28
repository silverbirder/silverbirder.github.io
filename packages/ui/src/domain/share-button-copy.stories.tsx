import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonCopy } from "./share-button-copy";

const meta = {
  component: ShareButtonCopy,
  title: "UI/Domain/ShareButtonCopy",
} satisfies Meta<typeof ShareButtonCopy>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    copiedLabel: "コピーしました",
    label: "リンクをコピー",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Empty: Story = {
  args: {
    copiedLabel: "コピーしました",
    label: "",
    url: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    copiedLabel: "コピーしました",
    label: "リンクをコピー",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    copiedLabel: "コピーしました",
    label: "リンクをコピー",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    copiedLabel: "コピーしました",
    label: "リンクをコピー",
    loading: true,
    loadingText: "準備中",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

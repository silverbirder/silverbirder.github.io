import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonWeb } from "./share-button-web";

const meta = {
  component: ShareButtonWeb,
  title: "UI/Domain/ShareButtonWeb",
} satisfies Meta<typeof ShareButtonWeb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "デバイスで共有",
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
    label: "デバイスで共有",
    text: "Broken URL",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "デバイスで共有",
    text: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    label: "デバイスで共有",
    loading: true,
    loadingText: "準備中",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonLine } from "./share-button-line";

const meta = {
  component: ShareButtonLine,
  title: "UI/Domain/ShareButtonLine",
} satisfies Meta<typeof ShareButtonLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "LINEでシェア",
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
    label: "LINEでシェア",
    text: "Broken URL",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "LINEでシェア",
    text: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    label: "LINEでシェア",
    loading: true,
    loadingText: "準備中",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

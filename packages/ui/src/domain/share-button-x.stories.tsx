import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonX } from "./share-button-x";

const meta = {
  component: ShareButtonX,
  title: "UI/Domain/ShareButtonX",
} satisfies Meta<typeof ShareButtonX>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "Xでシェア",
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
    label: "Xでシェア",
    text: "Broken URL",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "Xでシェア",
    text: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    label: "Xでシェア",
    loading: true,
    loadingText: "準備中",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

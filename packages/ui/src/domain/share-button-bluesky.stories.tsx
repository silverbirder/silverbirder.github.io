import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonBluesky } from "./share-button-bluesky";

const meta = {
  component: ShareButtonBluesky,
  title: "UI/Domain/ShareButtonBluesky",
} satisfies Meta<typeof ShareButtonBluesky>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "Blueskyでシェア",
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
    label: "Blueskyでシェア",
    text: "Broken URL",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "Blueskyでシェア",
    text: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    label: "Blueskyでシェア",
    loading: true,
    loadingText: "準備中",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

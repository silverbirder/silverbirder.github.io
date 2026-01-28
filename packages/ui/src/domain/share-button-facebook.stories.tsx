import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ShareButtonFacebook } from "./share-button-facebook";

const meta = {
  component: ShareButtonFacebook,
  title: "UI/Domain/ShareButtonFacebook",
} satisfies Meta<typeof ShareButtonFacebook>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "Facebookでシェア",
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
    label: "Facebookでシェア",
    text: "Broken URL",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "Facebookでシェア",
    text: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Loading: Story = {
  args: {
    label: "Facebookでシェア",
    loading: true,
    loadingText: "準備中",
    text: "Notebook Prose",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

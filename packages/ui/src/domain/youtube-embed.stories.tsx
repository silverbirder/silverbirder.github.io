import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { YouTubeEmbed } from "./youtube-embed";

const meta = {
  component: YouTubeEmbed,
  title: "UI/Domain/YouTubeEmbed",
} satisfies Meta<typeof YouTubeEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    src: "https://www.youtube-nocookie.com/embed/gFRtAAmiFbE",
    title: "YouTube example",
  },
};

export const Empty: Story = {
  args: {
    src: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    src: "https://www.youtube-nocookie.com/embed/not-found",
  },
};

export const Partial: Story = {
  args: {
    src: "https://www.youtube-nocookie.com/embed/gFRtAAmiFbE",
  },
};

export const Loading: Story = {
  args: {
    src: "https://www.youtube-nocookie.com/embed/gFRtAAmiFbE",
    title: "Loading embed",
  },
};

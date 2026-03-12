import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BlueskyEmbed } from "./bluesky-embed";

const meta = {
  component: BlueskyEmbed,
  title: "UI/Domain/BlueskyEmbed",
} satisfies Meta<typeof BlueskyEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    permalink: "https://bsky.app/profile/bsky.app/post/3l6ovsdood32z",
  },
};

export const Empty: Story = {
  args: {
    permalink: "",
  },
  render: () => <div />,
};

export const ErrorState: Story = {
  args: {
    permalink: "https://example.com/post/not-found",
  },
};

export const Partial: Story = {
  args: {
    permalink: "https://bsky.app/profile/example.com/post/3l6ovsdood32z",
  },
};

export const Loading: Story = {
  args: {
    permalink: "https://bsky.app/profile/bsky.app/post/3l6ovsdood32z",
  },
};

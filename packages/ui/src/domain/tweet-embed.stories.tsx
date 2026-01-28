import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TweetEmbed } from "./tweet-embed";

const meta = {
  component: TweetEmbed,
  title: "UI/Domain/TweetEmbed",
} satisfies Meta<typeof TweetEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    id: "1318861346327252993",
  },
};

export const Empty: Story = {
  args: {
    id: "1318861346327252993",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    id: "error",
  },
};

export const Partial: Story = {
  args: {
    id: "nodata",
  },
};

export const Loading: Story = {
  args: {
    fallback: <div aria-busy>Loading…</div>,
    id: "loading",
  },
};

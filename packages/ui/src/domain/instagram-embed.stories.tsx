import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { InstagramEmbed } from "./instagram-embed";

const meta = {
  component: InstagramEmbed,
  title: "UI/Domain/InstagramEmbed",
} satisfies Meta<typeof InstagramEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    permalink: "https://www.instagram.com/p/CuD4V0HOvqp/",
  },
};

export const Empty: Story = {
  args: {
    permalink: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    permalink: "https://www.instagram.com/p/not-found/",
  },
};

export const Partial: Story = {
  args: {
    captioned: false,
    permalink: "https://www.instagram.com/reel/CuD4V0HOvqp/",
  },
};

export const Loading: Story = {
  args: {
    permalink: "https://www.instagram.com/p/CuD4V0HOvqp/",
  },
};

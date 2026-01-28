import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Me } from "./me";

const meta = {
  component: Me,
  title: "Feature/User/Me",
} satisfies Meta<typeof Me>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    followLinks: {
      bluesky: "https://bsky.app/profile/silverbirder.bsky.social",
      github: "https://github.com/silverbirder",
      rss: "https://example.com/rss.xml",
      threads: "https://www.threads.com/@silverbirder",
      x: "https://x.com/silverbirder",
    },
  },
};

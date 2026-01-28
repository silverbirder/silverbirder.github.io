import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Top } from "./top";

const meta = {
  args: {
    blogSummary: {
      latestPublishedAt: "2024-01-01",
      totalCount: 42,
    },
  },
  component: Top,
  title: "Feature/User/Top",
} satisfies Meta<typeof Top>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Top } from "./top";

const meta = {
  args: {},
  component: Top,
  title: "Feature/Admin/Top",
} satisfies Meta<typeof Top>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    drafts: [
      {
        id: "draft-1",
        publishedAt: "2026-02-14",
        title: "Draft title",
        updatedAt: "2026-02-14T12:00:00.000Z",
      },
      {
        id: "draft-2",
        publishedAt: "2026-02-13",
        title: "",
        updatedAt: "2026-02-14T08:30:00.000Z",
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    drafts: [],
  },
};

export const Error: Story = {
  args: {
    drafts: [],
  },
};

export const Partial: Story = {
  args: {
    drafts: [
      {
        id: "draft-1",
        publishedAt: "2026-02-14",
        title: "Draft title",
        updatedAt: "2026-02-14T12:00:00.000Z",
      },
    ],
  },
};

export const Loading: Story = {
  args: {
    drafts: [],
  },
};

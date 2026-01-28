import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Top } from "./top";

const meta = {
  args: {
    name: "Alice",
    onSignOut: async () => {},
    posts: ["2025-01-01-first-post.md", "2025-02-14-release-notes.md"],
  },
  component: Top,
  title: "Feature/Admin/Top",
} satisfies Meta<typeof Top>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {};

export const Empty: Story = {
  args: {
    name: "",
    posts: [],
  },
};

export const Error: Story = {
  args: {
    name: "Failed to load user",
    posts: [],
  },
};

export const Partial: Story = {
  args: {
    name: "Signed in",
    posts: ["2025-03-10-preview.md"],
  },
};

export const Loading: Story = {
  args: {
    name: "Loading...",
    posts: [],
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotebookPostItem } from "./notebook-post-item";

const meta = {
  component: NotebookPostItem,
  title: "UI/Domain/NotebookPostItem",
} satisfies Meta<typeof NotebookPostItem>;

export default meta;

type Story = StoryObj<typeof meta>;

const basePost = {
  publishedAt: "2025-01-03",
  slug: "notebook-post",
  summary: "Notebook らしい読みやすさを意識した記事の一覧です。",
  tags: ["Notebook", "UI"],
  title: "Notebook Post",
};

export const Ideal: Story = {
  args: {
    metaSeparator: "/",
    post: basePost,
  },
};

export const Empty: Story = {
  args: {
    post: {
      ...basePost,
      summary: "",
      tags: [],
    },
  },
};

export const Error: Story = {
  args: {
    post: {
      ...basePost,
      summary: "??",
      tags: ["??"],
      title: "??",
    },
  },
};

export const Partial: Story = {
  args: {
    post: {
      publishedAt: "2025-01-03",
      slug: "partial-post",
      summary: "Partial summary",
      tags: [],
      title: "Partial Post",
    },
  },
};

export const Loading: Story = {
  args: {
    post: {
      ...basePost,
      summary: "Loading...",
      title: "Loading...",
    },
  },
};

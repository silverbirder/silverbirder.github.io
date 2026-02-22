import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { PostSummary } from "./posts.presenter";

import { Posts } from "./posts";

const basePosts: PostSummary[] = [
  {
    publishedAt: "2026-01-12",
    slug: "hello-world",
    summary: "Notebook-styled post list entry.",
    tags: ["TypeScript", "Next.js"],
    title: "Hello World",
  },
  {
    publishedAt: "2025-12-01",
    slug: "second",
    summary: "Second post summary line.",
    tags: ["Next.js"],
    title: "Second Post",
  },
  {
    publishedAt: "2025-11-01",
    slug: "third",
    summary: "Third post overview for the list.",
    tags: [],
    title: "Third Post",
  },
  {
    publishedAt: "2025-10-01",
    slug: "fourth",
    summary: "Fourth post summary content.",
    tags: ["TypeScript"],
    title: "Fourth Post",
  },
  {
    publishedAt: "2025-09-01",
    slug: "fifth",
    summary: "Fifth post summary snippet.",
    tags: ["Chakra"],
    title: "Fifth Post",
  },
  {
    publishedAt: "2025-08-01",
    slug: "sixth",
    summary: "Sixth post summary copy.",
    tags: ["Chakra"],
    title: "Sixth Post",
  },
];

const meta = {
  args: {
    posts: basePosts,
    rssUrl: "https://example.com/rss.xml",
  },
  component: Posts,
  title: "Feature/User/Posts",
} satisfies Meta<typeof Posts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {};

export const Empty: Story = {
  args: {
    posts: [],
  },
};

export const Partial: Story = {
  args: {
    posts: basePosts.slice(0, 2),
  },
};

export const Loading: Story = {
  args: {
    posts: [],
  },
};

export const Error: Story = {
  args: {
    posts: [],
  },
};

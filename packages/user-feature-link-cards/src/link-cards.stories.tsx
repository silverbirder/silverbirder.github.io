import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LinkCards } from "./link-cards";

const sampleCards = [
  {
    description: "GitHub repository page",
    faviconSrc: "/link-card/github.ico",
    siteName: "GitHub",
    thumbnailSrc: "/link-card/repo.png",
    title: "silverbirder/example",
    url: "https://github.com/silverbirder/example",
  },
  {
    description: "Example article page",
    faviconSrc: "/link-card/example.ico",
    siteName: "Example",
    thumbnailSrc: "/link-card/article.png",
    title: "Example Article",
    url: "https://example.com/article",
  },
];

const meta = {
  args: {
    cards: sampleCards,
    description: "2 件のリンクカードを確認できます。",
    empty: "リンクカードはまだありません。",
    title: "リンクカード一覧",
  },
  component: LinkCards,
  title: "Feature/User/LinkCards",
} satisfies Meta<typeof LinkCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {};

export const Empty: Story = {
  args: {
    cards: [],
  },
};

export const Error: Story = {
  args: {
    cards: [],
  },
};

export const Partial: Story = {
  args: {
    cards: sampleCards.slice(0, 1),
    description: "1 件のリンクカードを確認できます。",
  },
};

export const Loading: Story = {
  args: {
    cards: [],
  },
};

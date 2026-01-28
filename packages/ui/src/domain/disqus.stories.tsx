import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Disqus } from "./disqus";

const meta = {
  component: Disqus,
  title: "UI/Domain/Disqus",
} satisfies Meta<typeof Disqus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    shortname: "https-silverbirder-github-io",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Empty: Story = {
  args: {
    shortname: "https-silverbirder-github-io",
    url: "",
  },
};

export const Error: Story = {
  args: {
    shortname: "",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

export const Partial: Story = {
  args: {
    shortname: "https-silverbirder-github-io",
    url: "https://example.com/",
  },
};

export const Loading: Story = {
  args: {
    shortname: "https-silverbirder-github-io",
    url: "https://example.com/blog/contents/notebook-prose/",
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PostSearchPanel } from "./post-search-panel";

const meta = {
  component: PostSearchPanel,
  title: "UI/Domain/PostSearchPanel",
} satisfies Meta<typeof PostSearchPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

const noop = () => {
  return;
};

export const Ideal: Story = {
  args: {
    initialQuery: "react",
    onResultsChange: noop,
  },
};

export const Empty: Story = {
  args: {
    initialQuery: "",
    onResultsChange: noop,
  },
};

export const Error: Story = {
  args: {
    initialQuery: "error",
    onResultsChange: noop,
  },
};

export const Partial: Story = {
  args: {
    initialQuery: "partial",
    onResultsChange: noop,
  },
};

export const Loading: Story = {
  args: {
    initialQuery: "loading",
    onResultsChange: noop,
  },
};

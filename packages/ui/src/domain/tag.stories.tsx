import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tag } from "./tag";

const meta = {
  component: Tag,
  title: "UI/Domain/Tag",
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    tag: "Notebook",
  },
};

export const Empty: Story = {
  args: {
    tag: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    tag: "??",
  },
};

export const Partial: Story = {
  args: {
    isSelected: true,
    tag: "UI",
  },
};

export const Loading: Story = {
  args: {
    tag: "Loading",
  },
};

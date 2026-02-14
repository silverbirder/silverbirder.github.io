import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Top } from "./top";

const meta = {
  args: {},
  component: Top,
  title: "Feature/Admin/Top",
} satisfies Meta<typeof Top>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {};

export const Empty: Story = {
  args: {},
};

export const Error: Story = {
  args: {},
};

export const Partial: Story = {
  args: {},
};

export const Loading: Story = {
  args: {},
};

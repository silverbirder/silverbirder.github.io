import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SignIn } from "./sign-in";

const meta = {
  component: SignIn,
  title: "Feature/Admin/SignIn",
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {},
};

export const Empty: Story = {
  args: {},
};

export const Error: Story = {
  args: {
    status: "forbidden",
  },
};

export const Partial: Story = {
  args: {},
};

export const Loading: Story = {
  args: {},
};

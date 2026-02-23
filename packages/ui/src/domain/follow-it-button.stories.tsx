import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FollowItButton } from "./follow-it-button";

const meta = {
  component: FollowItButton,
  title: "UI/Domain/FollowItButton",
} satisfies Meta<typeof FollowItButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    label: "メール通知を受け取る",
    url: "https://follow.it/qxug4e?leanpub",
  },
};

export const Empty: Story = {
  args: {
    label: "",
    url: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    label: "メール通知を受け取る",
    url: "not-a-url",
  },
};

export const Partial: Story = {
  args: {
    label: "メール通知を受け取る",
    url: "",
  },
};

export const Loading: Story = {
  args: {
    label: "メール通知を受け取る",
    url: "https://follow.it/qxug4e?leanpub",
  },
};

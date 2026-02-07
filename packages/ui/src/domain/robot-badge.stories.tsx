import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RobotBadge } from "./robot-badge";

const meta = {
  component: RobotBadge,
  title: "UI/Domain/RobotBadge",
} satisfies Meta<typeof RobotBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    boxSize: "24px",
    status: "index",
  },
};

export const Empty: Story = {
  args: {
    boxSize: "24px",
    status: "index",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    boxSize: "24px",
    status: "noindex",
  },
};

export const Partial: Story = {
  args: {
    boxSize: "20px",
    opacity: 0.7,
    status: "index",
  },
};

export const Loading: Story = {
  args: {
    boxSize: "24px",
    opacity: 0.4,
    status: "index",
  },
};

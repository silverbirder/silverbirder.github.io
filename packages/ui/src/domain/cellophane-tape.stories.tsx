import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CellophaneTape } from "./cellophane-tape";

const meta = {
  component: CellophaneTape,
  title: "UI/Domain/CellophaneTape",
} satisfies Meta<typeof CellophaneTape>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    height: "28px",
    width: "96px",
  },
};

export const Empty: Story = {
  render: () => <div />,
};

export const Error: Story = {
  args: {
    filter: "grayscale(100%)",
    height: "28px",
    opacity: 0.35,
    width: "96px",
  },
};

export const Partial: Story = {
  args: {
    height: "20px",
    opacity: 0.6,
    width: "64px",
  },
};

export const Loading: Story = {
  args: {
    filter: "blur(0.4px)",
    height: "28px",
    opacity: 0.5,
    width: "96px",
  },
};

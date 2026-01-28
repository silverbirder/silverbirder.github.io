import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Spiral } from "./spiral";

const meta = {
  component: Spiral,
  title: "UI/Domain/Spiral",
} satisfies Meta<typeof Spiral>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {},
};

export const Empty: Story = {
  render: () => <div />,
};

export const CustomDuration: Story = {
  args: {
    duration: 3,
  },
};

export const CustomPause: Story = {
  args: {
    pause: 1,
  },
};

export const CustomStrokeColor: Story = {
  args: {
    strokeColor: "#ff6b6b",
  },
};

export const AllCustomProps: Story = {
  args: {
    className: "custom-spiral",
    duration: 2.5,
    pause: 0.8,
    strokeColor: "#4ecdc4",
  },
};

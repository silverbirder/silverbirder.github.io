import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PaperStack } from "./paper-stack";

const meta: Meta<typeof PaperStack> = {
  args: {
    maxCount: 10,
  },
  component: PaperStack,
  decorators: [
    (Story) => (
      <div style={{ height: "120px", width: "120px" }}>
        <Story />
      </div>
    ),
  ],
  title: "UI/Domain/PaperStack",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    count: 10,
  },
};

export const Empty: Story = {
  args: {
    count: 0,
  },
};

export const Error: Story = {
  args: {
    count: 10,
  },
};

export const Partial: Story = {
  args: {
    count: 4,
  },
};

export const Loading: Story = {
  args: {
    count: 10,
  },
};

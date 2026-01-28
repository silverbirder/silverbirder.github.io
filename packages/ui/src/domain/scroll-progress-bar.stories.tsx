import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";

import { ScrollProgressBar } from "./scroll-progress-bar";

const wrapperStyle: CSSProperties = {
  background: "var(--chakra-colors-bg-muted)",
  border: "1px solid var(--chakra-colors-border)",
  height: "48px",
  position: "relative",
  width: "100%",
};

const meta = {
  component: ScrollProgressBar,
  title: "UI/Domain/ScrollProgressBar",
} satisfies Meta<typeof ScrollProgressBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    position: "absolute",
  },
  render: (args) => (
    <div style={wrapperStyle}>
      <ScrollProgressBar {...args} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => <div />,
};

export const Error: Story = {
  args: {
    color: "#d64545",
    height: "4px",
    position: "absolute",
  },
  render: (args) => (
    <div role="alert" style={wrapperStyle}>
      <ScrollProgressBar {...args} />
    </div>
  ),
};

export const Partial: Story = {
  args: {
    color: "#c97b2f",
    height: "2px",
    position: "absolute",
  },
  render: (args) => (
    <div style={{ ...wrapperStyle, height: "32px" }}>
      <ScrollProgressBar {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    position: "absolute",
  },
  render: (args) => (
    <div aria-busy="true" style={{ ...wrapperStyle, opacity: 0.6 }}>
      <ScrollProgressBar {...args} />
    </div>
  ),
};

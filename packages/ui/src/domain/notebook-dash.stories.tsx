import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";

import { NotebookDash } from "./notebook-dash";

const wrapperStyle: CSSProperties = {
  background: "var(--chakra-colors-bg-muted)",
  border: "1px solid var(--chakra-colors-border)",
  height: "120px",
  position: "relative",
  width: "100%",
};

const meta = {
  component: NotebookDash,
  title: "UI/Domain/NotebookDash",
} satisfies Meta<typeof NotebookDash>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    height: 6,
    patternWidth: 128,
  },
  render: (args) => (
    <div style={wrapperStyle}>
      <NotebookDash {...args} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    height: 6,
    patternWidth: 128,
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    height: 2,
    patternWidth: 8,
  },
  render: (args) => (
    <div role="alert" style={wrapperStyle}>
      <NotebookDash {...args} />
    </div>
  ),
};

export const Partial: Story = {
  args: {
    height: 3,
    patternWidth: 16,
  },
  render: (args) => (
    <div style={{ ...wrapperStyle, height: "64px" }}>
      <NotebookDash {...args} />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    height: 6,
    patternWidth: 128,
  },
  render: (args) => (
    <div aria-busy="true" style={{ ...wrapperStyle, opacity: 0.6 }}>
      <NotebookDash {...args} />
    </div>
  ),
};

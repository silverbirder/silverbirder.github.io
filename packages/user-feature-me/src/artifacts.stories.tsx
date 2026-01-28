import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";

import { ArtifactsSection } from "./artifacts";

const baseStyle: CSSProperties = {
  padding: "24px",
};

const meta = {
  component: ArtifactsSection,
  title: "Feature/User/ArtifactsSection",
} satisfies Meta<typeof ArtifactsSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  render: () => (
    <div style={baseStyle}>
      <ArtifactsSection />
    </div>
  ),
};

export const Empty: Story = {
  render: () => <div />,
};

export const Error: Story = {
  render: () => (
    <div role="alert" style={baseStyle}>
      <ArtifactsSection />
    </div>
  ),
};

export const Partial: Story = {
  render: () => (
    <div style={{ ...baseStyle, maxHeight: "240px", overflow: "hidden" }}>
      <ArtifactsSection />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div aria-busy="true" style={baseStyle}>
      <ArtifactsSection />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";

import { SkillsSection } from "./skills-section";

const baseStyle: CSSProperties = {
  padding: "24px",
};

const meta = {
  component: SkillsSection,
  title: "Feature/User/SkillsSection",
} satisfies Meta<typeof SkillsSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  render: () => (
    <div style={baseStyle}>
      <SkillsSection />
    </div>
  ),
};

export const Empty: Story = {
  render: () => <div />,
};

export const Error: Story = {
  render: () => (
    <div role="alert" style={baseStyle}>
      <SkillsSection />
    </div>
  ),
};

export const Partial: Story = {
  render: () => (
    <div style={{ ...baseStyle, maxHeight: "240px", overflow: "hidden" }}>
      <SkillsSection />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div aria-busy="true" style={baseStyle}>
      <SkillsSection />
    </div>
  ),
};

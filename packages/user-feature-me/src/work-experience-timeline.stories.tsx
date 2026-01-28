import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { CSSProperties } from "react";

import { WorkExperienceTimeline } from "./work-experience-timeline";

const baseStyle: CSSProperties = {
  padding: "24px",
};

const meta = {
  component: WorkExperienceTimeline,
  title: "Feature/User/WorkExperienceTimeline",
} satisfies Meta<typeof WorkExperienceTimeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  render: () => (
    <div style={baseStyle}>
      <WorkExperienceTimeline />
    </div>
  ),
};

export const Empty: Story = {
  render: () => <div />,
};

export const Error: Story = {
  render: () => (
    <div role="alert" style={baseStyle}>
      <WorkExperienceTimeline />
    </div>
  ),
};

export const Partial: Story = {
  render: () => (
    <div style={{ ...baseStyle, maxHeight: "240px", overflow: "hidden" }}>
      <WorkExperienceTimeline />
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div aria-busy="true" style={baseStyle}>
      <WorkExperienceTimeline />
    </div>
  ),
};

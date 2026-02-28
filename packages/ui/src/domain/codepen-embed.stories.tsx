import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CodepenEmbed } from "./codepen-embed";

const meta = {
  component: CodepenEmbed,
  title: "UI/Domain/CodepenEmbed",
} satisfies Meta<typeof CodepenEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    src: "https://codepen.io/silverbirder/embed/gbYwrOa",
    title: "CodePen example",
  },
};

export const Empty: Story = {
  args: {
    src: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    src: "https://codepen.io/silverbirder/embed/not-found",
  },
};

export const Partial: Story = {
  args: {
    src: "https://codepen.io/silverbirder/embed/gbYwrOa",
  },
};

export const Loading: Story = {
  args: {
    src: "https://codepen.io/silverbirder/embed/gbYwrOa",
    title: "Loading embed",
  },
};

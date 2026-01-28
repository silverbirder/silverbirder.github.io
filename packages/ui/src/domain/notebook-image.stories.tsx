import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotebookImage } from "./notebook-image";

const PLACEHOLDER_SRC = "https://placehold.co/400x400";

const meta = {
  component: NotebookImage,
  title: "UI/Domain/NotebookImage",
} satisfies Meta<typeof NotebookImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    alt: "Notebook sample",
    src: PLACEHOLDER_SRC,
  },
};

export const Empty: Story = {
  render: () => <div />,
};

export const Error: Story = {
  args: {
    alt: "Missing image",
    src: "",
  },
};

export const Partial: Story = {
  args: {
    alt: "No src placeholder",
  },
};

export const Loading: Story = {
  args: {
    alt: "Lazy image",
    loading: "lazy",
    src: PLACEHOLDER_SRC,
  },
};

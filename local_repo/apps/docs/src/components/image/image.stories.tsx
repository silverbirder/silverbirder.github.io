import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Image, type ImageProps } from "./image";

const meta: Meta<ImageProps> = {
  component: Image,
};

type Story = StoryObj<ImageProps>;

export default meta;

export const Primary: Story = {
  args: {
    src: "https://res.cloudinary.com/silverbirder/image/upload/v1693381103/silver-birder.github.io/blog/ai_ghost_writer_demo.gif",
    width: 640,
    height: 389,
    layout: "constrained",
    alt: "AI Ghostwriter DEMO",
    href: "https://github.com/silverbirder",
  },
};

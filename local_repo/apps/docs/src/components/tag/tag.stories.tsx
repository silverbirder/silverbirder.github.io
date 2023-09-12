import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Tag, type TagProps } from "./tag";

const meta: Meta<TagProps> = {
  component: Tag,
};

type Story = StoryObj<TagProps>;

export default meta;

export const Primary: Story = {
  args: {
    name: "Some tag",
    url: "/some-tag",
  },
};

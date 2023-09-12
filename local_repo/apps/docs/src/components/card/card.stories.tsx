import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Card, type CardProps } from "./card";
import { css } from "~/styled-system/css";

const meta: Meta<CardProps> = {
  component: Card,
};

type Story = StoryObj<CardProps>;

export default meta;

export const Primary: Story = {
  args: {
    name: "Card",
    image:
      "https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png",
    description: "This is a card",
  },
  render: (props) => {
    return (
      <div class={css({ padding: 10 })}>
        <Card {...props} />
      </div>
    );
  },
};

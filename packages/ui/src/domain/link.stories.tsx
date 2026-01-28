import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Link } from "./link";

const meta = {
  component: Link,
  title: "UI/Domain/Link",
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    children: "Internal link",
    href: "/blog",
  },
};

export const Empty: Story = {
  args: {
    children: "",
    href: "",
  },
  render: () => <div />,
};

export const Error: Story = {
  args: {
    children: "Broken link",
    href: "",
  },
};

export const Partial: Story = {
  args: {
    children: "External link",
    href: "https://example.com",
  },
};

export const Loading: Story = {
  args: {
    "aria-busy": true,
    children: "Loading link",
    href: "/loading",
  },
};

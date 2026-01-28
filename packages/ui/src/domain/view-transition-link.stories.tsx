import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Box } from "@chakra-ui/react";

import { ViewTransitionLink } from "./view-transition-link";

const meta = {
  component: ViewTransitionLink,
  title: "UI/Domain/ViewTransitionLink",
} satisfies Meta<typeof ViewTransitionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    children: "Go to /blog",
    href: "/blog",
    transitionName: "page",
    transitionUpdate: "replace",
  },
};

export const Empty: Story = {
  args: {
    children: "",
    href: "/",
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
    children: "Link without transition props",
    href: "/blog",
  },
};

export const Loading: Story = {
  args: {
    children: "Loading…",
    href: "/blog",
  },
  render: (args) => (
    <Box aria-busy>
      <ViewTransitionLink {...args} />
    </Box>
  ),
};

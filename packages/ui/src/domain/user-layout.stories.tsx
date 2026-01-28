import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Box, Heading, Text } from "@chakra-ui/react";

import { UserLayout } from "./user-layout";

const meta = {
  component: UserLayout,
  title: "Domain/UserLayout",
} satisfies Meta<typeof UserLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const baseArgs: Story["args"] = {
  children: (
    <Box>
      <Heading as="h2" size="md">
        Centered Layout
      </Heading>
      <Text>Content goes here.</Text>
    </Box>
  ),
};

export const Ideal: Story = {
  args: baseArgs,
};

export const Empty: Story = {
  args: {
    ...baseArgs,
    children: <Box minH="80px" />,
  },
};

export const Error: Story = {
  args: {
    ...baseArgs,
    children: (
      <Box>
        <Heading as="h2" size="md">
          Centered Layout
        </Heading>
        <Text color="fg.muted">Failed to load.</Text>
      </Box>
    ),
  },
};

export const Partial: Story = {
  args: {
    ...baseArgs,
    children: (
      <Box>
        <Heading as="h2" size="md">
          Centered Layout
        </Heading>
      </Box>
    ),
  },
};

export const Loading: Story = {
  args: {
    ...baseArgs,
    children: (
      <Box aria-busy>
        <Heading as="h2" size="md">
          Centered Layout
        </Heading>
        <Text>Loading…</Text>
      </Box>
    ),
  },
};

import type { Meta, StoryObj } from "storybook-framework-qwik";
import {
  PostSummaryList,
  type PostSummaryListProps,
} from "./post-summary-list";

const meta: Meta<PostSummaryListProps> = {
  component: PostSummaryList,
};

type Story = StoryObj<PostSummaryListProps>;

export default meta;

export const Primary: Story = {
  args: {
    data: [
      {
        title: "title",
        description: "description",
        permalink: "permalink",
        date: "2023-01-01",
        tags: ["tag1", "tag2"],
        published: true,
      },
    ],
  },
};

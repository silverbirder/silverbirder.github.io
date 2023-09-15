import type { Meta, StoryObj } from "storybook-framework-qwik";
import { Pagination, type PaginationProps } from "./pagination";
import { component$, useSignal, $ } from "@builder.io/qwik";

const meta: Meta<PaginationProps> = {
  component: Pagination,
};

type Story = StoryObj<PaginationProps>;

export default meta;

export const Primary: Story = {
  args: {
    page: 1,
    pageSize: 10,
    total: 100,
  },
  render: (props) => <Wrapper {...props} />,
};

const Wrapper = component$((props: PaginationProps) => {
  const page = useSignal(props.page);
  const onPageChange = $((p: number) => {
    page.value = p;
  });
  return (
    <Pagination {...props} page={page.value} onPageChange={onPageChange} />
  );
});

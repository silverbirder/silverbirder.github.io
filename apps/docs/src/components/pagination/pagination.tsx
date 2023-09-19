import { component$, $, useSignal, type QRL } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination = component$<PaginationProps>((props) => {
  const { page, pageSize, total, onPageChange } = props;
  const pages = Math.ceil(total / pageSize);
  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div
      class={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      })}
    >
      {pagesArray.map((p) => (
        <button
          key={p}
          onClick$={() => onPageChange(p)}
          class={[
            css({
              padding: "2",
              margin: "2",
              borderRadius: "base",
              backgroundColor: "bg.quote",
              borderColor: "bg.quote",
              borderWidth: "medium",
              cursor: "pointer",
            }),
            p === page
              ? css({
                  fontWeight: "bold",
                })
              : css({
                  fontWeight: "normal",
                }),
          ]}
        >
          {p}
        </button>
      ))}
    </div>
  );
});

export type UsePaginationProps = {
  page: number;
  pageSize: number;
  items: any[];
  onPageChangeAfter: QRL<(page: number) => void>;
};

export const usePagination = (props: UsePaginationProps) => {
  const { page, pageSize, onPageChangeAfter } = props;
  const pageState = useSignal(page);
  const total = props.items.length;

  const onPageChange = $((p: number) => {
    pageState.value = p;
    onPageChangeAfter(p);
  });

  const calculatedItems = (page: number, pageSize: number, data: any[]) => {
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return data.slice(startIdx, endIdx);
  };

  return {
    page: pageState.value,
    total,
    pageSize,
    onPageChange,
    calculatedItems,
  };
};

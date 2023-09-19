import { component$, $, useSignal, type NoSerialize } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const Pagination = component$<PaginationProps>((props) => {
  const { page, pageSize, total } = props;
  const pages = Math.ceil(total / pageSize);
  const pagesArray = Array.from({ length: pages }, (_, i) => i + 1);
  const location = useLocation();

  const handleClick = $((p: number) => {
    location.url.searchParams.set("page", p.toString());
    window.history.pushState({}, "", location.url);
    window.scrollTo({ top: 0, behavior: "smooth" });
    props.onPageChange(p);
  });

  return (
    <div>
      {pagesArray.map((p) => (
        <button
          key={p}
          onClick$={() => handleClick(p)}
          style={{ fontWeight: p === page ? "bold" : "normal" }}
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
  onPageChange: NoSerialize<(page: number) => void>;
};

export const usePagination = (props: UsePaginationProps) => {
  const { page, items, pageSize, onPageChange: propsOnPageChange } = props;
  const pageState = useSignal(page);
  const itemsState = useSignal(items.slice(0, pageSize));
  const total = props.items.length;

  const onPageChange = $((p: number) => {
    pageState.value = p;
    const startIdx = (pageState.value - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    itemsState.value = items.slice(startIdx, endIdx);
    propsOnPageChange && propsOnPageChange(p);
  });

  return {
    page: pageState.value,
    items: itemsState.value,
    total,
    pageSize,
    onPageChange,
  };
};

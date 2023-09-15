import { component$ } from "@builder.io/qwik";

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
    <div>
      {pagesArray.map((p) => (
        <button
          key={p}
          onClick$={() => onPageChange(p)}
          style={{ fontWeight: p === page ? "bold" : "normal" }}
        >
          {p}
        </button>
      ))}
    </div>
  );
});

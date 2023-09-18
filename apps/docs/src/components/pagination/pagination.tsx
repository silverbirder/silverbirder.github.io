import { component$, $ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";

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
  const location = useLocation();

  const handleClick = $((p: number) => {
    location.url.searchParams.set("page", p.toString());
    window.history.pushState({}, "", location.url);
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageChange(p);
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

import { component$, useSignal, $ } from "@builder.io/qwik";
import data from "./index.json";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";
import { Pagination } from "~/components/pagination/pagination";
import { useLocation } from "@builder.io/qwik-city";

export const PostSummaryListWithPagination = component$(() => {
  const location = useLocation();
  const initialPage = parseInt(
    location.url.searchParams.get("page") || "1",
    10
  );
  const page = useSignal(initialPage);
  const pageSize = 10;
  const total = data.length;

  const startIdx = (page.value - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const slicedData = data.slice(startIdx, endIdx);

  const onPageChange = $((p: number) => {
    page.value = p;
  });

  return (
    <>
      <PostSummaryList data={slicedData} />
      <Pagination
        page={page.value}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
      />
    </>
  );
});

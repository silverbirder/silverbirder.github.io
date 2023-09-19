import { component$, noSerialize } from "@builder.io/qwik";
import { PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";
import { type PostSummary } from "~/models";
import { useLocation } from "@builder.io/qwik-city";
import { usePagination, Pagination } from "../pagination/pagination";

export interface PostSummaryListProps {
  data: PostSummary[];
}

export const PostSummaryList = component$(({ data }: PostSummaryListProps) => {
  return (
    <>
      {data.map(({ title, description, permalink, tags, date, published }) => (
        <PostSummaryListItem
          key={title}
          title={title}
          description={description}
          permalink={permalink}
          tags={tags}
          date={date}
          published={published}
        />
      ))}
    </>
  );
});

export const PostSummaryListWithPagination = component$(
  ({ data }: PostSummaryListProps) => {
    const location = useLocation();
    const initialPage = parseInt(
      location.url.searchParams.get("page") || "1",
      10
    );
    const onPageChange = noSerialize((page: number) => {
      location.url.searchParams.set("page", page.toString());
      window.history.pushState({}, "", location.url);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    const { items, ...paginationProps } = usePagination({
      page: initialPage,
      pageSize: 10,
      items: data,
      onPageChange,
    });

    return (
      <>
        <PostSummaryList data={items} />
        <Pagination {...paginationProps} />
      </>
    );
  }
);

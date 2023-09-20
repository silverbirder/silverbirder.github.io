import { component$, $ } from "@builder.io/qwik";
import { PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";
import { type PostSummary } from "~/models";
import { useNavigate } from "@builder.io/qwik-city";
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

export interface PostSummaryListWithPaginationProps {
  data: PostSummary[];
  page?: number;
  urlPath?: string;
}

export const PostSummaryListWithPagination = component$(
  ({
    data,
    page = 1,
    urlPath = "/blog/pages",
  }: PostSummaryListWithPaginationProps) => {
    const nav = useNavigate();
    const onPageChangeAfter = $((page: number) => {
      nav(`${urlPath}/${page}/`);
    });

    const { calculatedItems, ...paginationProps } = usePagination({
      page,
      pageSize: 10,
      items: data,
      onPageChangeAfter,
    });

    const items = calculatedItems(
      paginationProps.page,
      paginationProps.pageSize,
      data
    );

    return (
      <>
        <PostSummaryList data={items} />
        <Pagination {...paginationProps} />
      </>
    );
  }
);

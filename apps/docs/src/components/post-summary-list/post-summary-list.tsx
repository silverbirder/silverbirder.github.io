import { component$, $ } from "@builder.io/qwik";
import { PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";
import { type PostSummary } from "~/models";
import { useNavigate } from "@builder.io/qwik-city";
import { usePagination, Pagination } from "../pagination/pagination";
import { useSpeakLocale } from "qwik-speak";
import { useLinkHref } from "../link/link";

export interface PostSummaryListProps {
  data: PostSummary[];
}

export const PostSummaryList = component$(({ data }: PostSummaryListProps) => {
  return (
    <>
      {data.map(
        ({ title, description, permalink, tags, date, published, lang }) => (
          <PostSummaryListItem
            key={title}
            title={title}
            description={description}
            permalink={permalink}
            tags={tags}
            date={date}
            published={published}
            lang={lang}
          />
        )
      )}
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
    const l = useSpeakLocale();
    const navHref = useLinkHref(urlPath);
    const lData = data.filter((d) => d.lang === l.lang);

    const onPageChangeAfter = $((page: number) => {
      nav(`${navHref}/${page}/`);
    });

    const { calculatedItems, ...paginationProps } = usePagination({
      page,
      pageSize: 10,
      items: lData,
      onPageChangeAfter,
    });

    const items = calculatedItems(
      paginationProps.page,
      paginationProps.pageSize,
      lData
    );

    return (
      <>
        <PostSummaryList data={items} />
        <Pagination {...paginationProps} />
      </>
    );
  }
);

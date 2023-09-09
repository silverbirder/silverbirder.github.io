import { component$ } from "@builder.io/qwik";
import { PostSummaryListItem } from "./post-summary-list-item/post-summary-list-item";
import { type PostSummary } from "~/models";

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

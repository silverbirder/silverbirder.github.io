import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import data from "./index.json";
import { PostSummaryListWithPagination } from "~/components/post-summary-list/post-summary-list";

export default component$(() => {
  return <PostSummaryListWithPagination data={data} />;
});

export const head: DocumentHead = ({ head }) => {
  return {
    ...head,
    title: `Blog`,
    meta: [
      {
        name: "description",
        content: "silverbirder's blog",
      },
    ],
  };
};

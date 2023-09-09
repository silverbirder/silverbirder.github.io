import { component$ } from "@builder.io/qwik";
import data from "./index.json";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";

export default component$(() => {
  return <PostSummaryList data={data}></PostSummaryList>;
});

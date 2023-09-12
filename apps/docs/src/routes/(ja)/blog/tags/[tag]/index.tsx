import { component$ } from "@builder.io/qwik";
import { type StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import data from "../../index.json";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";

export default component$(() => {
  const loc = useLocation();
  const tagPosts = data.filter(
    ({ tags }) => tags.indexOf(loc.params.tag) !== -1
  );
  return <PostSummaryList data={tagPosts}></PostSummaryList>;
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const tags = Array.from(new Set(data.map(({ tags }) => tags).flat()));
  return {
    params: tags.map((tag) => {
      return { tag };
    }),
  };
};

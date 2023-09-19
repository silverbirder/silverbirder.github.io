import { component$ } from "@builder.io/qwik";
import { type StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import data from "../../index.json";
import { PostSummaryListWithPagination } from "~/components/post-summary-list/post-summary-list";
import { stringToSlug } from "~/util";

export default component$(() => {
  const loc = useLocation();
  const tagPosts = data.filter(
    ({ tags }) =>
      tags.map((tag) => stringToSlug(tag)).indexOf(loc.params.tag) !== -1
  );
  return (
    <PostSummaryListWithPagination
      data={tagPosts}
    ></PostSummaryListWithPagination>
  );
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const tags = Array.from(new Set(data.map(({ tags }) => tags).flat())).map(
    (tag) => stringToSlug(tag)
  );
  return {
    params: tags.map((tag) => {
      return { tag };
    }),
  };
};

import { component$ } from "@builder.io/qwik";
import {
  type StaticGenerateHandler,
  useLocation,
  type DocumentHead,
} from "@builder.io/qwik-city";
import data from "../../index.json";
import { PostSummaryListWithPagination } from "~/components/post-summary-list/post-summary-list";

export default component$(() => {
  const loc = useLocation();
  const page = parseInt(loc.params.page);
  return (
    <PostSummaryListWithPagination
      data={data}
      page={page}
    ></PostSummaryListWithPagination>
  );
});

export const onStaticGenerate: StaticGenerateHandler = () => {
  const pages = Math.ceil(data.length / 10);
  const pagesArray = Array.from({ length: pages }, (_, i) => `${i + 1}`);
  return {
    params: pagesArray.map((page) => ({
      page,
    })),
  };
};

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

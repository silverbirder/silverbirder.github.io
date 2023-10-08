import { component$ } from "@builder.io/qwik";
import {
  type StaticGenerateHandler,
  type DocumentHead,
} from "@builder.io/qwik-city";
import data from "./index.json";
import { PostSummaryListWithPagination } from "~/components/post-summary-list/post-summary-list";
import { config } from "~/speak-config";

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

export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map((locale) => {
      return {
        lang: locale.lang !== config.defaultLocale.lang ? locale.lang : ".",
      };
    }),
  };
};

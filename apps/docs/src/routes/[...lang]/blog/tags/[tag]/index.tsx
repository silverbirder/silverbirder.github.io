import { component$ } from "@builder.io/qwik";
import { type StaticGenerateHandler, useLocation } from "@builder.io/qwik-city";
import data from "../../index.json";
import { PostSummaryList } from "~/components/post-summary-list/post-summary-list";
import { stringToSlug } from "~/util";
import { useSpeakLocale } from "qwik-speak";
import { config } from "~/speak-config";

export default component$(() => {
  const loc = useLocation();
  const sl = useSpeakLocale();
  const tagPosts = data
    .filter(
      ({ tags }) =>
        tags.map((tag) => stringToSlug(tag)).indexOf(loc.params.tag) !== -1
    )
    .filter(({ lang }) => lang === sl.lang);
  return <PostSummaryList data={tagPosts}></PostSummaryList>;
});

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const tags = Array.from(new Set(data.map(({ tags }) => tags).flat())).map(
    (tag) => stringToSlug(tag)
  );
  const langs = config.supportedLocales.map((locale) => {
    return locale.lang !== config.defaultLocale.lang ? locale.lang : ".";
  });
  // TODOタグも言語でフィルタする
  const params = tags.flatMap((tag) => {
    return langs.map((lang) => {
      return { tag, lang };
    });
  });

  return { params };
};

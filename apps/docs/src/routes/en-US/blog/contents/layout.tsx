import { Slot, component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { BlogContentsLayout } from "~/components/pages/blog-contents-layout/blog-contents-layout";
import data from "~/routes/(ja)/blog/index.json";

export default component$(() => {
  return (
    <BlogContentsLayout>
      <Slot />
    </BlogContentsLayout>
  );
});

export const head: DocumentHead = ({ head }) => {
  const description = head.meta.find((m) => m.name === "description")?.content;
  const currentPosts = data.filter((post) => post.title === head.title);
  const permalink = currentPosts.length > 0 ? currentPosts[0].permalink : "";
  return {
    ...head,
    frontmatter: {
      ...head.frontmatter,
      permalink: "https://silverbirder.github.io" + permalink,
    },
    meta: [
      ...head.meta,
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "silverbirder | Blog" },
      { name: "twitter:creator", content: "silverbirder" },
      { name: "twitter:title", content: head.title },
      { name: "twitter:description", content: description },
      {
        name: "twitter:image",
        content:
          "https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png",
      },
      { property: "og:title", content: head.title },
      { property: "og:type", content: "article" },
      {
        property: "og:url",
        content: "https://silverbirder.github.io" + permalink,
      },
      {
        property: "og:image",
        content:
          "https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png",
      },
      { property: "og:description", content: description },
      { property: "og:site_name", content: "silverbirder" },
    ],
  };
};

import { component$, Slot } from "@builder.io/qwik";
import { type DocumentHead, useDocumentHead } from "@builder.io/qwik-city";
import { BuyMeACoffee } from "~/components/buy-me-a-coffee/buy-me-a-coffee";
import { IonLogoHackernews } from "~/components/icon/ion";
import {
  SimpleIconsFacebook,
  SimpleIconsHatenabookmark,
  SimpleIconsLinkedin,
  SimpleIconsMastodon,
  SimpleIconsReddit,
  SimpleIconsTwitter,
} from "~/components/icon/simple";
import { Tag } from "~/components/tag/tag";
import data from "~/routes/(ja)/blog/index.json";
import { css } from "~/styled-system/css";
import { HStack } from "~/styled-system/jsx";

export default component$(() => {
  const head = useDocumentHead();
  const tags: string[] = head.frontmatter.tags || [];
  return (
    <article>
      <section>
        <h1>{head.title}</h1>
        <div
          class={css({
            display: "flex",
            flexDirection: "row",
            gap: 1,
            flexWrap: "wrap",
          })}
        >
          {tags.map((tag) => (
            <Tag url={`/blog/tags/${tag}`} name={tag} key={tag} />
          ))}
        </div>
        <Slot />
      </section>
      <section>
        <div
          class={css({
            marginTop: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div
            class={css({
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            })}
          >
            <BuyMeACoffee />
            <p
              class={css({
                fontSize: "0.8rem",
                color: "gray.500",
              })}
            >
              役立ったら、☕でサポートしてね！
            </p>
          </div>
        </div>
        <h2>Share</h2>
        <div
          class={css({
            display: "flex",
            flexDirection: "row",
            gap: 1,
          })}
        >
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `${head.title} by @silverbirder | silverbirder.github.io ${head.frontmatter.permalink}`
            )}`}
            target="_blank"
            class={css({ color: "blue.500", _hover: { color: "blue.900" } })}
          >
            <SimpleIconsTwitter
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
              head.frontmatter.permalink
            )}&title=${encodeURIComponent(head.title)}`}
            target="_blank"
            class={css({ color: "blue.500", _hover: { color: "blue.900" } })}
          >
            <SimpleIconsLinkedin
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a
            href={`https://www.reddit.com/submit?url=${encodeURIComponent(
              head.frontmatter.permalink
            )}&title=${encodeURIComponent(head.title)}`}
            target="_blank"
            class={css({ color: "red.500", _hover: { color: "red.900" } })}
          >
            <SimpleIconsReddit
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a
            href={`https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
              head.frontmatter.permalink
            )}&t=${encodeURIComponent(head.title)}`}
            target="_blank"
            class={css({
              color: "orange.500",
              _hover: { color: "orange.900" },
            })}
          >
            <IonLogoHackernews
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a
            href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent(
              head.frontmatter.permalink
            )}`}
            target="_blank"
            class={css({ color: "blue.500", _hover: { color: "blue.900" } })}
          >
            <SimpleIconsFacebook
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a
            href={`https://toot.kytta.dev/?text=${encodeURIComponent(
              head.frontmatter.permalink
            )}`}
            target="_blank"
            class={css({ color: "blue.500", _hover: { color: "blue.900" } })}
          >
            <SimpleIconsMastodon
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
          <a
            href={`https://b.hatena.ne.jp/entry/panel/?url=${encodeURIComponent(
              head.frontmatter.permalink
            )}`}
            target="_blank"
            class={css({ color: "blue.500", _hover: { color: "blue.900" } })}
          >
            <SimpleIconsHatenabookmark
              class={css({ width: "icon.main", height: "icon.main" })}
            />
          </a>
        </div>
      </section>
      <section>
        <h2>関連するタグ</h2>
        <RelatedTags currentTags={tags} currentTitle={head.title} />
      </section>
      <section>
        <script
          src="https://giscus.app/client.js"
          data-repo="silverbirder/silverbirder.github.io"
          data-repo-id="MDEwOlJlcG9zaXRvcnkxNzEwMTQ5MjI="
          data-category="Announcements"
          data-category-id="DIC_kwDOCjF7Cs4CZNjT"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="1"
          data-input-position="top"
          data-theme="light"
          data-lang="ja"
          data-loading="lazy"
          crossOrigin="anonymous"
          async
        ></script>
      </section>
    </article>
  );
});

interface RelatedTagsProps {
  currentTags: string[];
  currentTitle: string;
}

const RelatedTags = component$(
  ({ currentTags, currentTitle }: RelatedTagsProps) => {
    return (
      <>
        {currentTags.map((tag) => {
          const relatedTagPosts = data.filter(
            (post) =>
              post.tags.indexOf(tag) !== -1 && currentTitle !== post.title
          );
          if (relatedTagPosts.length === 0) return <></>;
          return (
            <section key={tag}>
              <Tag url={`/blog/tags/${tag}`} name={tag} />
              <ul>
                {relatedTagPosts.map((post) => (
                  <li key={post.title}>
                    <a href={post.permalink}>{post.title}</a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </>
    );
  }
);

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

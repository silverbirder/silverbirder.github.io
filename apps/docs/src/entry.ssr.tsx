/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
import { isDev } from "@builder.io/qwik/build";
import type { RenderOptions } from "@builder.io/qwik/server";
import Root from "./root";
import { type DocumentHeadProps } from "@builder.io/qwik-city";
import { config } from "./speak-config";
import { asyncMap } from "./util";
import fs from "fs";

/**
 * Determine the base URL to use for loading the chunks in the browser.
 * The value set through Qwik 'locale()' in 'plugin.ts' is saved by Qwik in 'serverData.locale' directly.
 * Make sure the locale is among the 'supportedLocales'
 */
export function extractBase({ serverData }: RenderOptions): string {
  if (!isDev && serverData?.locale) {
    return "/build/" + serverData.locale;
  } else {
    return "/build";
  }
}

export default async function (opts: RenderToStreamOptions) {
  await generateBlogJaFrontMatter();
  await generateBlogEnFrontMatter();
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Determine the base URL for the client code
    base: extractBase,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: opts.serverData?.locale || config.defaultLocale.lang,
      ...opts.containerAttributes,
    },
  });
}

const generateBlogJaFrontMatter = async () => {
  const modules = await import.meta.glob(
    "/src/routes/\\(ja\\)/blog/contents/**/**/index.mdx"
  );
  const posts = (
    await asyncMap(Object.keys(modules), async (path) => {
      const data = (await modules[path]()) as DocumentHeadProps;
      return {
        title: data.head.title || "",
        description:
          data.head.meta.find((m) => m.name === "description")?.content || "",
        permalink: path
          .replace(/^\/src\/routes\/\(ja\)/, "")
          .replace(/\/index.mdx$/, "/"),
        date: data.head.frontmatter.date,
        tags: data.head.frontmatter.tags,
        published: data.head.frontmatter.published,
        lang: data.head.frontmatter.lang,
        socialMediaImage: data.head.frontmatter.socialMediaImage,
      };
    })
  )
    .filter(({ published }) => published)
    .filter(({ lang }) => lang === "ja-JP")
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  fs.writeFileSync("./src/routes/(ja)/blog/index.json", JSON.stringify(posts));
};

const generateBlogEnFrontMatter = async () => {
  const modules = await import.meta.glob(
    "/src/routes/en-US/blog/contents/**/**/index.mdx"
  );
  const posts = (
    await asyncMap(Object.keys(modules), async (path) => {
      const data = (await modules[path]()) as DocumentHeadProps;
      return {
        title: data.head.title || "",
        description:
          data.head.meta.find((m) => m.name === "description")?.content || "",
        permalink: path
          .replace(/^\/src\/routes\/en-US/, "")
          .replace(/\/index.mdx$/, "/"),
        date: data.head.frontmatter.date,
        tags: data.head.frontmatter.tags,
        published: data.head.frontmatter.published,
        lang: data.head.frontmatter.lang,
        socialMediaImage: data.head.frontmatter.socialMediaImage,
      };
    })
  )
    .filter(({ published }) => published)
    .filter(({ lang }) => lang === "en-US")
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  fs.writeFileSync("./src/routes/en-US/blog/index.json", JSON.stringify(posts));
};

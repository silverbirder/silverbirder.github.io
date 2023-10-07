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
import { isDev } from "@builder.io/qwik/build";
import type { RenderOptions } from "@builder.io/qwik/server";
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import { manifest } from "@qwik-client-manifest";
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
  await generateBlogFrontMatter();
  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Determine the base URL for the client code
    base: extractBase,
    // Use container attributes to set attributes on the html tag
    containerAttributes: {
      lang: opts.serverData?.locale || config.defaultLocale.lang,
      ...opts.containerAttributes,
    },
  });
}

const generateBlogFrontMatter = async () => {
  const modules = await import.meta.glob(
    "/src/routes/\\[...lang\\]/blog/contents/**/**/index.mdx"
  );
  const posts = (
    await asyncMap(Object.keys(modules), async (path) => {
      const data = (await modules[path]()) as DocumentHeadProps;
      return {
        title: data.head.title || "",
        description:
          data.head.meta.find((m) => m.name === "description")?.content || "",
        permalink: path
          .replace(/^\/src\/routes\/\[\.\.\.lang\]/, "")
          .replace(/\/index.mdx$/, "/"),
        date: data.head.frontmatter.date,
        tags: data.head.frontmatter.tags,
        published: data.head.frontmatter.published,
        lang: data.head.frontmatter.lang,
      };
    })
  )
    .filter(({ published }) => published)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  fs.writeFileSync(
    "./src/routes/[...lang]/blog/index.json",
    JSON.stringify(posts)
  );
};

import type { Pluggable } from "unified";

import { createRemarkLinkCardGuard } from "@repo/util";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkLinkCardPlus from "remark-link-card-plus";
import remarkMdx from "remark-mdx";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

type MdxOptions = {
  rehypePlugins: Pluggable[];
  remarkPlugins: Pluggable[];
};

const rehypePlugins: Pluggable[] = [
  [
    rehypeRaw,
    {
      passThrough: ["mdxjsEsm", "mdxJsxFlowElement", "mdxJsxTextElement"],
    },
  ],
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "wrap",
      properties: {
        className: ["mdx-heading-anchor"],
      },
    },
  ],
  [
    rehypePrettyCode,
    {
      keepBackground: false,
      theme: {
        dark: "github-dark",
        light: "github-light",
      },
    },
  ],
];

const baseRemarkPlugins: Pluggable[] = [
  remarkGfm,
  createRemarkLinkCardGuard,
  [remarkLinkCardPlus, { cache: false, noThumbnail: false, shortenUrl: true }],
];

const createOptions = (remarkPlugins: Pluggable[]): MdxOptions => ({
  rehypePlugins,
  remarkPlugins,
});

export const createMdxOptions = (): MdxOptions =>
  createOptions([
    remarkFrontmatter,
    remarkMdx,
    remarkMdxFrontmatter,
    ...baseRemarkPlugins,
  ]);

export const createMarkdownOptions = (): MdxOptions =>
  createOptions([remarkFrontmatter, ...baseRemarkPlugins]);

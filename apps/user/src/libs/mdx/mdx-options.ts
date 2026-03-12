import type { LinkCardMetadata } from "@repo/util";
import type { Pluggable } from "unified";

import { createRemarkLinkCard, createRemarkLinkCardGuard } from "@repo/util";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

type CreateOptionsArgs = {
  resolveLinkCard?: (
    url: string,
  ) => LinkCardMetadata | null | Promise<LinkCardMetadata | null>;
};

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

const createBaseRemarkPlugins = ({
  resolveLinkCard,
}: CreateOptionsArgs): Pluggable[] => [
  remarkGfm,
  createRemarkLinkCardGuard,
  [
    createRemarkLinkCard,
    {
      resolveCard: resolveLinkCard,
    },
  ],
];

const createOptions = (remarkPlugins: Pluggable[]): MdxOptions => ({
  rehypePlugins,
  remarkPlugins,
});

export const createMdxOptions = (args: CreateOptionsArgs = {}): MdxOptions =>
  createOptions([
    remarkFrontmatter,
    remarkMdx,
    remarkMdxFrontmatter,
    ...createBaseRemarkPlugins(args),
  ]);

export const createMarkdownOptions = (
  args: CreateOptionsArgs = {},
): MdxOptions =>
  createOptions([
    remarkFrontmatter,
    remarkMdx,
    ...createBaseRemarkPlugins(args),
  ]);

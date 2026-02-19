import { createRemarkLinkCardGuard } from "@repo/util";
import { serialize } from "next-mdx-remote-client/serialize";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkLinkCardPlus from "remark-link-card-plus";
import remarkMdx from "remark-mdx";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const mdxRouter = createTRPCRouter({
  preview: publicProcedure
    .input(
      z.object({
        source: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return serialize({
        options: {
          disableExports: true,
          disableImports: true,
          mdxOptions: {
            rehypePlugins: [
              [
                rehypeRaw,
                {
                  passThrough: [
                    "mdxjsEsm",
                    "mdxJsxFlowElement",
                    "mdxJsxTextElement",
                  ],
                },
              ],
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: "wrap",
                  properties: { className: ["mdx-heading-anchor"] },
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
            ],
            remarkPlugins: [
              remarkGfm,
              remarkMdx,
              createRemarkLinkCardGuard,
              [
                remarkLinkCardPlus,
                { cache: false, noThumbnail: false, shortenUrl: true },
              ],
            ],
          },
        },
        source: input.source,
      });
    }),
});

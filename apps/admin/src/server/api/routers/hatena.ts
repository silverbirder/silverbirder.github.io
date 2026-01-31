import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const buildAtomEntry = ({
  author,
  body,
  title,
}: {
  author: string;
  body: string;
  title: string;
}) => `<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">
  <title>${escapeXml(title)}</title>
  <author><name>${escapeXml(author)}</name></author>
  <content type="text/plain">${escapeXml(body)}</content>
  <app:control>
    <app:draft>yes</app:draft>
    <app:preview>yes</app:preview>
  </app:control>
</entry>
`;

const extractLinkHref = (xml: string, rel: string) => {
  const match = xml.match(
    new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, "i"),
  );
  return match?.[1] ?? null;
};

export const hatenaRouter = createTRPCRouter({
  createDraft: protectedProcedure
    .input(
      z.object({
        body: z.string().min(1),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const entry = buildAtomEntry({
        author: env.HATENA_ID,
        body: input.body,
        title: input.title,
      });
      const endpoint = `https://blog.hatena.ne.jp/${env.HATENA_ID}/${env.HATENA_BLOG_DOMAIN}/atom/entry`;
      const authToken = Buffer.from(
        `${env.HATENA_ID}:${env.HATENA_API_KEY}`,
        "utf8",
      ).toString("base64");

      const response = await fetch(endpoint, {
        body: entry,
        headers: {
          Accept: "application/atom+xml",
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/atom+xml; charset=utf-8",
        },
        method: "POST",
      });

      const responseBody = await response.text();

      if (!response.ok) {
        throw new TRPCError({
          cause: responseBody,
          code: "INTERNAL_SERVER_ERROR",
          message: `Hatena API error: ${response.status} ${response.statusText}`,
        });
      }

      return {
        editUrl: extractLinkHref(responseBody, "edit"),
        previewUrl: extractLinkHref(responseBody, "preview"),
      };
    }),
});

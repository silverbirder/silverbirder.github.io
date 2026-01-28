import type { TimelineItem } from "@repo/user-feature-top";

import { serialize } from "next-mdx-remote-client/serialize";

import { createMarkdownOptions } from "../mdx/mdx-options";
import { getTimelineEntry, getTimelineSlugs } from "./timeline";

export const getTimelineList = async (
  loader: (slug: string) => Promise<{
    description: string;
    publishedAt: string;
    slug: string;
    type: "bookmark" | "share" | "tweet";
  }> = getTimelineEntry,
): Promise<TimelineItem[]> => {
  const slugs = await getTimelineSlugs();
  const entries = await Promise.all(
    slugs.map(async ({ publishedAt, slug }) => {
      const entry = await loader(slug);
      const compiled = await serialize({
        options: {
          disableExports: true,
          disableImports: true,
          mdxOptions: createMarkdownOptions(),
        },
        source: entry.description,
      });
      const compiledSource =
        "compiledSource" in compiled ? compiled.compiledSource : "";
      return {
        compiledSource,
        date: publishedAt,
        key: `timeline-${slug}`,
        type: entry.type,
      } satisfies TimelineItem;
    }),
  );

  const toDateValue = (value: string) => {
    const dateValue = Date.parse(value);
    return Number.isNaN(dateValue) ? 0 : dateValue;
  };

  return entries
    .sort((a, b) => toDateValue(b.date) - toDateValue(a.date))
    .slice(0, 5);
};

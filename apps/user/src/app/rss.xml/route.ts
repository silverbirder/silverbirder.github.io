import { siteDescription, siteName } from "@repo/metadata";
import { buildSiteUrl, toDate } from "@repo/util";
import { Feed } from "feed";

import { getPostFrontmatter, getPostSlugs } from "@/libs";

export const dynamic = "force-static";

export type RssItem = {
  publishedAt: string;
  slug: string;
  summary?: string;
  title: string;
};

const loadPostFrontmatter = async (slug: string) => {
  return getPostFrontmatter(slug);
};

export const getRssItems = async (
  loader: (
    slug: string,
  ) => Promise<Record<string, unknown>> = loadPostFrontmatter,
) => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async ({ publishedAt, slug }) => {
      const frontmatter = await loader(slug);
      const title =
        typeof frontmatter.title === "string" ? frontmatter.title : slug;
      const summary =
        typeof frontmatter.summary === "string"
          ? frontmatter.summary
          : undefined;

      return { publishedAt, slug, summary, title } satisfies RssItem;
    }),
  );

  return posts;
};

export const buildRssXml = (items: RssItem[]) => {
  const siteUrl = buildSiteUrl("");
  const blogUrl = buildSiteUrl("blog/");
  const newestDate = toDate(
    items.at(0)?.publishedAt ?? new Date().toISOString(),
  );
  const feed = new Feed({
    copyright: siteName,
    description: siteDescription,
    feedLinks: {
      rss: buildSiteUrl("rss.xml"),
    },
    id: siteUrl,
    language: "ja",
    link: blogUrl,
    title: siteName,
    updated: newestDate,
  });

  items.forEach((item) => {
    const link = buildSiteUrl(`blog/contents/${item.slug}/`);
    const date = toDate(item.publishedAt);

    feed.addItem({
      date,
      description: item.summary ?? "",
      id: link,
      link,
      title: item.title,
    });
  });

  return feed.rss2();
};

export const getRssXml = async (
  loader: (
    slug: string,
  ) => Promise<Record<string, unknown>> = loadPostFrontmatter,
) => {
  const items = await getRssItems(loader);
  return buildRssXml(items);
};

export async function GET() {
  const rssXml = await getRssXml();

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

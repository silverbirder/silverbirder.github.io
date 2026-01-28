import type { MetadataRoute } from "next";

import { buildSiteUrl } from "@repo/util";

import { getPostSlugs } from "@/libs";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPostSlugs();

  return [
    { url: buildSiteUrl("") },
    { url: buildSiteUrl("me/") },
    { url: buildSiteUrl("blog/") },
    ...slugs.map(({ slug }) => ({
      url: buildSiteUrl(`blog/contents/${slug}/`),
    })),
  ];
}

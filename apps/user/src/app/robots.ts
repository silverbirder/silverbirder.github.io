import type { MetadataRoute } from "next";

import { buildSiteUrl, getSiteMetadataBase } from "@repo/util";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const metadataBase = getSiteMetadataBase();

  return {
    host: metadataBase.origin,
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: buildSiteUrl("sitemap.xml"),
  };
}

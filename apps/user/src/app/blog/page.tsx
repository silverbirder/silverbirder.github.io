import type { Metadata } from "next";

import { siteName } from "@repo/metadata";
import { Posts } from "@repo/user-feature-posts";
import { buildSiteUrl } from "@repo/util";

import { getPostList } from "@/libs";

const title = "ブログ";
const description = `${siteName}のブログ記事一覧。技術や日々の学びをまとめています。`;
const canonical = buildSiteUrl("blog/");
const ogImageUrl = buildSiteUrl("blog/opengraph-image");

export const metadata: Metadata = {
  alternates: {
    canonical,
  },
  description,
  keywords: [siteName, "ブログ", "記事一覧", "技術ブログ", "学び"],
  openGraph: {
    description,
    images: [
      {
        alt: siteName,
        height: 630,
        url: ogImageUrl,
        width: 1200,
      },
    ],
    siteName,
    title,
    type: "website",
    url: canonical,
  },
  title,
  twitter: {
    description,
    images: [ogImageUrl],
    title,
  },
};

export default async function Page() {
  const posts = await getPostList();

  return <Posts posts={posts} />;
}

import type { Metadata } from "next";

import { siteName } from "@repo/metadata";
import { Top } from "@repo/user-feature-top";
import { buildSiteUrl } from "@repo/util";

import { getPostList, getTimelineList } from "@/libs";

const title = "ジブンノート";
const description =
  "silverbirder のホームページ。ブログ記事や自己紹介などを掲載しています。";
const canonical = buildSiteUrl("");
const ogImageUrl = buildSiteUrl("opengraph-image");

export const metadata: Metadata = {
  alternates: {
    canonical,
  },
  description,
  keywords: [siteName, "ホーム", "個人サイト", "ブログ", "プロフィール"],
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

const buildBlogSummary = (posts: { publishedAt: string }[]) => {
  const latestPublishedAt = posts[0]?.publishedAt ?? "";
  return {
    latestPublishedAt,
    totalCount: posts.length,
  };
};

export default async function Page() {
  const [timelineItems, posts] = await Promise.all([
    getTimelineList(),
    getPostList(),
  ]);
  const blogSummary = buildBlogSummary(posts);

  return <Top blogSummary={blogSummary} timelineItems={timelineItems} />;
}

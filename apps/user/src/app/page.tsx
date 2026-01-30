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

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

const toDayValue = (value: number | string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return Math.floor((date.getTime() + JST_OFFSET_MS) / 86400000);
};

const countConsecutiveDays = (posts: { publishedAt: string }[]) => {
  const dayValues = new Set<number>();
  let maxDayValue = -Infinity;
  posts.forEach((post) => {
    const dayValue = toDayValue(post.publishedAt);
    if (dayValue === null) {
      return;
    }
    dayValues.add(dayValue);
    if (dayValue > maxDayValue) {
      maxDayValue = dayValue;
    }
  });

  if (dayValues.size === 0) {
    return 0;
  }

  const todayValue = toDayValue(Date.now());
  if (todayValue === null) {
    return 0;
  }

  const baseValue = Math.max(todayValue, maxDayValue);
  const startValue = dayValues.has(baseValue)
    ? baseValue
    : dayValues.has(baseValue - 1)
      ? baseValue - 1
      : null;
  if (startValue === null) {
    return 0;
  }

  let streak = 0;
  for (let day = startValue; dayValues.has(day); day -= 1) {
    streak += 1;
  }

  return streak;
};

export const buildBlogSummary = (posts: { publishedAt: string }[]) => {
  const latestPublishedAt = posts[0]?.publishedAt ?? "";
  return {
    latestPublishedAt,
    streakDays: countConsecutiveDays(posts),
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

import type { Metadata } from "next";

import { siteName } from "@repo/metadata";
import { Me } from "@repo/user-feature-me";
import { buildSiteUrl } from "@repo/util";

const title = "自己紹介";
const description = `${siteName}についての紹介ページ。職歴や成果物、お気に入りの技術などを掲載しています。`;
const canonical = buildSiteUrl("me/");
const ogImageUrl = buildSiteUrl("me/opengraph-image.png");

export const metadata: Metadata = {
  alternates: {
    canonical,
  },
  description,
  keywords: [
    siteName,
    "自己紹介",
    "プロフィール",
    "職歴",
    "成果物",
    "お気に入りの技術",
  ],
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

export default function Page() {
  const rssUrl = buildSiteUrl("rss.xml");
  const followLinks = {
    bluesky: "https://bsky.app/profile/silverbirder.bsky.social",
    github: "https://github.com/silverbirder",
    rss: rssUrl,
    threads: "https://www.threads.com/@silverbirder",
    x: "https://x.com/silverbirder",
  };

  return <Me followLinks={followLinks} />;
}

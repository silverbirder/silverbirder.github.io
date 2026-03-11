import type { Metadata } from "next";

import { siteName } from "@repo/metadata";
import { LinkCards } from "@repo/user-feature-link-cards";
import { buildSiteUrl } from "@repo/util";
import { getTranslations } from "next-intl/server";

import { listLinkCards } from "@/libs/link-card-list";

const title = "リンクカード一覧";
const description = `${siteName} で生成したリンクカードの確認ページです。`;
const canonical = buildSiteUrl("link-cards/");

export const metadata: Metadata = {
  alternates: {
    canonical,
  },
  description,
  robots: {
    index: false,
  },
  title,
};

export default async function Page() {
  const t = await getTranslations("user.linkCards");
  const cards = await listLinkCards();

  return (
    <LinkCards
      cards={cards}
      description={t("description", { count: cards.length })}
      empty={t("empty")}
      title={t("title")}
    />
  );
}

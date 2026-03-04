"use client";

import { Box } from "@chakra-ui/react";
import {
  createFollowSection,
  type FollowLinks,
  MdxClientWrapper,
  Notebook,
  ScrollProgressBar,
} from "@repo/ui";
import { useTranslations } from "next-intl";

const COUNTER_NAMESPACE = "silverbirder-github-io";
const FOLLOW_IT_URL = "https://follow.it/qxug4e?leanpub";
const OFUSE_ID = "158382";
const OFUSE_URL = `https://ofuse.me/o?uid=${OFUSE_ID}`;

type Props = {
  compiledSource: string;
  followLinks: FollowLinks;
  meta: {
    index?: boolean;
    postNumber?: number;
    publishedAt: string;
    tags: string[];
    title: string;
  };
  navigation: {
    next?: {
      href: string;
      publishedAt: string;
      title: string;
    };
    prev?: {
      href: string;
      publishedAt: string;
      title: string;
    };
  };
  relatedPosts: {
    posts: {
      publishedAt?: string;
      slug: string;
      summary: string;
      tags: string[];
      title: string;
    }[];
    tag: string;
  }[];
  shareUrl: string;
  slug: string;
};

export const PostArticle = ({
  compiledSource,
  followLinks,
  meta,
  navigation,
  relatedPosts,
  shareUrl,
  slug,
}: Props) => {
  const t = useTranslations("user.blog");
  const shareText = t("shareText", { title: meta.title });
  const share = {
    heading: t("shareHeading"),
    labels: {
      bluesky: t("shareBlueskyLabel"),
      copy: t("shareCopyLabel"),
      copyCopied: t("shareCopyCopied"),
      hatena: t("shareHatenaLabel"),
      web: t("shareWebLabel"),
      x: t("shareXLabel"),
    },
    text: shareText,
    url: shareUrl,
  };
  const follow = createFollowSection({
    labels: {
      bluesky: t("followBlueskyLabel"),
      github: t("followGithubLabel"),
      heading: t("followHeading"),
      x: t("followXLabel"),
    },
    links: followLinks,
  });
  const indexStatus = meta.index === false ? "noindex" : "index";
  const like = {
    name: slug,
    namespace: COUNTER_NAMESPACE,
    title: meta.title,
  };
  const subscription = {
    emailLabel: t("subscribeEmailLabel"),
    emailUrl: FOLLOW_IT_URL,
    heading: t("subscribeHeading"),
    label: t("followRssLabel"),
    url: followLinks.rss,
  };
  const support = {
    heading: t("supportHeading"),
    ofuse: {
      id: OFUSE_ID,
      label: t("supportOfuseLabel"),
      style: "rectangle" as const,
      url: OFUSE_URL,
    },
  };

  return (
    <Box w="full">
      <ScrollProgressBar />
      <Notebook
        comments={{ slug }}
        follow={follow}
        indexStatus={indexStatus}
        isBackToBlog={true}
        like={like}
        navigation={navigation}
        postNumber={meta.postNumber}
        publishedAt={meta.publishedAt}
        relatedPosts={relatedPosts}
        share={share}
        subscription={subscription}
        support={support}
        tags={meta.tags}
        title={meta.title}
      >
        <MdxClientWrapper compiledSource={compiledSource} />
      </Notebook>
    </Box>
  );
};

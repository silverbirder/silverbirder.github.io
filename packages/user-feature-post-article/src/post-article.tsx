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
      facebook: t("shareFacebookLabel"),
      hatena: t("shareHatenaLabel"),
      line: t("shareLineLabel"),
      threads: t("shareThreadsLabel"),
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
      threads: t("followThreadsLabel"),
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
    heading: t("subscribeHeading"),
    label: t("followRssLabel"),
    url: followLinks.rss,
  };

  return (
    <Box w="full">
      <ScrollProgressBar />
      <Notebook
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
        tags={meta.tags}
        title={meta.title}
      >
        <MdxClientWrapper compiledSource={compiledSource} />
      </Notebook>
    </Box>
  );
};

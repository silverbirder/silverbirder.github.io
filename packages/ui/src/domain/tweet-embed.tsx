"use client";

import type { ReactNode } from "react";
import type { QuotedTweet, Tweet, TweetEntities } from "react-tweet/api";

import { chakra } from "@chakra-ui/react";
import { TweetSkeleton } from "react-tweet";
import { EmbeddedTweet, TweetNotFound, useTweet } from "react-tweet";

import { useNotebookLineGridPadding } from "./embed-grid";

type Props = {
  apiUrl?: string;
  fallback?: ReactNode;
  id: string;
};

type QuotedTweetWithPartialEntities = Omit<QuotedTweet, "entities"> &
  TweetBaseWithPartialEntities;

type TweetBaseWithPartialEntities = {
  entities?: Partial<TweetEntities>;
};

type TweetWithPartialEntities = Omit<Tweet, "entities" | "quoted_tweet"> &
  TweetBaseWithPartialEntities & {
    quoted_tweet?: QuotedTweetWithPartialEntities;
  };

const normalizeEntities = (
  entities: Partial<TweetEntities> | undefined,
): TweetEntities => ({
  hashtags: entities?.hashtags ?? [],
  media: entities?.media,
  symbols: entities?.symbols ?? [],
  urls: entities?.urls ?? [],
  user_mentions: entities?.user_mentions ?? [],
});

const normalizeQuotedTweetEntities = (tweet: QuotedTweet): QuotedTweet => {
  const tweetWithPartialEntities = tweet as QuotedTweetWithPartialEntities;

  return {
    ...tweet,
    entities: normalizeEntities(tweetWithPartialEntities.entities),
  };
};

const normalizeTweetEntities = (tweet: Tweet): Tweet => {
  const tweetWithPartialEntities = tweet as TweetWithPartialEntities;

  return {
    ...tweet,
    entities: normalizeEntities(tweetWithPartialEntities.entities),
    quoted_tweet: tweetWithPartialEntities.quoted_tweet
      ? normalizeQuotedTweetEntities(
          tweetWithPartialEntities.quoted_tweet as QuotedTweet,
        )
      : undefined,
  };
};

const TweetContainer = chakra("div", {
  base: {
    "& a": {
      color: "green.fg",
      textDecoration: "underline",
      textDecorationColor: "green.muted",
      textUnderlineOffset: "0.2em",
    },
    "& a:hover": {
      color: "green.emphasized",
      textDecorationColor: "green.emphasized",
    },
  },
});

export const TweetEmbed = ({
  apiUrl,
  fallback = <TweetSkeleton />,
  id,
}: Props) => {
  const { data, error, isLoading } = useTweet(id, apiUrl);
  const { paddingBottom, ref } = useNotebookLineGridPadding();

  return (
    <TweetContainer
      className="oembed-card not-prose"
      data-embed="tweet"
      data-tweet-id={id}
      display="flow-root"
      lineHeight="var(--notebook-line-height)"
      paddingBottom={paddingBottom}
      ref={ref}
    >
      {isLoading ? (
        fallback
      ) : error || !data ? (
        <TweetNotFound error={error} />
      ) : (
        <EmbeddedTweet tweet={normalizeTweetEntities(data)} />
      )}
    </TweetContainer>
  );
};

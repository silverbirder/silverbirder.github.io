"use client";

import type { ReactNode } from "react";

import { chakra } from "@chakra-ui/react";
import { TweetSkeleton } from "react-tweet";
import { EmbeddedTweet, TweetNotFound, useTweet } from "react-tweet";

import { useNotebookLineGridPadding } from "./embed-grid";

type Props = {
  apiUrl?: string;
  fallback?: ReactNode;
  id: string;
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
        <EmbeddedTweet tweet={data} />
      )}
    </TweetContainer>
  );
};

"use client";

import type { ReactNode } from "react";

import { chakra } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  EmbeddedTweet,
  TweetNotFound,
  TweetSkeleton,
  useTweet,
} from "react-tweet";

type Props = {
  apiUrl?: string;
  fallback?: ReactNode;
  id: string;
};

const resolveNotebookLineHeightPxFromElement = (element: HTMLElement) => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.getComputedStyle(element).lineHeight;
  const px = Number.parseFloat(value);
  if (!Number.isFinite(px) || px <= 0) {
    return null;
  }
  return px;
};

const computePaddingToNextMultiple = (heightPx: number, unitPx: number) => {
  if (!Number.isFinite(heightPx) || !Number.isFinite(unitPx) || unitPx <= 0) {
    return 0;
  }
  const remainder = heightPx % unitPx;
  if (remainder < 0.5 || unitPx - remainder < 0.5) {
    return 0;
  }
  return unitPx - remainder;
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

  const outerRef = useRef<HTMLDivElement | null>(null);
  const [paddingBottomPx, setPaddingBottomPx] = useState(0);
  const paddingBottomPxRef = useRef(0);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) {
      return;
    }

    let rafId = 0;
    const update = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        const notebookLineHeightPx =
          resolveNotebookLineHeightPxFromElement(outer);
        if (!notebookLineHeightPx) {
          return;
        }
        const measuredOuter = outer.getBoundingClientRect().height;
        const measuredBase = Math.max(
          0,
          measuredOuter - paddingBottomPxRef.current,
        );
        const nextPadding = computePaddingToNextMultiple(
          measuredBase,
          notebookLineHeightPx,
        );
        setPaddingBottomPx((prev) => {
          const resolved =
            Math.abs(prev - nextPadding) < 0.5 ? prev : nextPadding;
          paddingBottomPxRef.current = resolved;
          return resolved;
        });
      });
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    const observer = new ResizeObserver(() => {
      update();
    });
    observer.observe(outer);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <TweetContainer
      className="oembed-card not-prose"
      data-embed="tweet"
      data-tweet-id={id}
      display="flow-root"
      lineHeight="var(--notebook-line-height)"
      paddingBottom={paddingBottomPx ? `${paddingBottomPx}px` : undefined}
      ref={outerRef}
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

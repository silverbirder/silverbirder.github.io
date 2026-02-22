"use client";

import { Box, IconButton, Text, VStack } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuThumbsUp } from "react-icons/lu";

import { NOTEBOOK_LINE_HEIGHT } from "./notebook-prose";

type Props = {
  name: string;
  namespace: string;
  title?: string;
};

type Status = "error" | "idle" | "loading";

const API_BASE_URL = process.env.NEXT_PUBLIC_LIKES_API_URL!;
const CLICK_BALLOON_DURATION_MS = 3000;
const BALLOON_HIDE_DURATION_MS = 200;
const HOVER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

const getCountFromPayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  const count =
    data.count ??
    data.value ??
    (typeof data.data === "object" && data.data
      ? ((data.data as Record<string, unknown>).count ??
        (data.data as Record<string, unknown>).value)
      : undefined);
  if (typeof count === "number") return count;
  if (typeof count === "string") {
    const parsed = Number.parseInt(count, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const toSafeKey = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "_");

const buildStorageKey = (namespace: string, name: string) =>
  `likes:${toSafeKey(namespace)}:${toSafeKey(name)}`;

const buildApiUrl = (slug: string, anonId?: string) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const url = new URL(`${base}/api/likes`);
  url.searchParams.set("slug", slug);
  if (anonId) {
    url.searchParams.set("anonId", anonId);
  }
  return url.toString();
};

const resolveAnonId = (storageKey: string) => {
  if (typeof window === "undefined") return null;
  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;
  const id =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.localStorage.setItem(storageKey, id);
  return id;
};

const canUseHoverBalloon = () => {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return true;
  return window.matchMedia(HOVER_MEDIA_QUERY).matches;
};

export const NotebookLike = ({ name, namespace, title }: Props) => {
  const t = useTranslations("ui.notebook");
  const [count, setCount] = useState<null | number>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [liked, setLiked] = useState(false);
  const [anonId, setAnonId] = useState<null | string>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [clickedWhenLiked, setClickedWhenLiked] = useState(false);
  const [visibleBalloonLabel, setVisibleBalloonLabel] = useState<null | string>(
    null,
  );
  const clickedTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const balloonHideTimerRef = useRef<null | ReturnType<typeof setTimeout>>(
    null,
  );

  const storageKey = useMemo(
    () => buildStorageKey(namespace, name),
    [namespace, name],
  );

  useEffect(() => {
    const resolved = resolveAnonId(storageKey);
    if (resolved) {
      setAnonId(resolved);
    }
  }, [storageKey]);

  useEffect(() => {
    return () => {
      if (clickedTimerRef.current) {
        clearTimeout(clickedTimerRef.current);
      }
      if (balloonHideTimerRef.current) {
        clearTimeout(balloonHideTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!anonId) {
      return () => {
        cancelled = true;
      };
    }

    const load = async () => {
      setStatus("loading");
      try {
        const res = await fetch(buildApiUrl(name, anonId));
        if (!res.ok) {
          throw new Error(`Likes API error: ${res.status}`);
        }
        const payload = await res.json();
        const value = getCountFromPayload(payload);
        if (!cancelled) {
          setCount(value);
          setStatus("idle");
          if (typeof payload?.liked === "boolean") {
            setLiked(payload.liked);
          }
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [anonId, name]);

  const handleLike = async () => {
    if (status === "loading") return;
    setClickedWhenLiked(liked);
    setClicked(true);
    if (clickedTimerRef.current) {
      clearTimeout(clickedTimerRef.current);
      clickedTimerRef.current = null;
    }
    clickedTimerRef.current = setTimeout(() => {
      setClicked(false);
      clickedTimerRef.current = null;
    }, CLICK_BALLOON_DURATION_MS);

    setStatus("loading");
    try {
      if (!anonId) {
        throw new Error("anonId is not available");
      }
      const res = await fetch(`${API_BASE_URL}/api/likes`, {
        body: JSON.stringify({ anonId, slug: name, title }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`Likes API error: ${res.status}`);
      }
      const payload = await res.json();
      const value = getCountFromPayload(payload);
      setCount(value);
      if (typeof payload?.liked === "boolean") {
        setLiked(payload.liked);
      } else {
        setLiked(true);
      }
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  const handleHoverStart = () => {
    setHovered(canUseHoverBalloon());
  };

  const countLabel = count ?? "-";
  const balloonLabel = clicked
    ? t(
        clickedWhenLiked
          ? "likeButtonClickedWhenLikedBalloon"
          : "likeButtonClickedBalloon",
      )
    : hovered
      ? t("likeButtonHoverBalloon")
      : null;
  const renderedBalloonLabel = balloonLabel ?? visibleBalloonLabel;

  useEffect(() => {
    if (balloonLabel) {
      if (balloonHideTimerRef.current) {
        clearTimeout(balloonHideTimerRef.current);
        balloonHideTimerRef.current = null;
      }
      setVisibleBalloonLabel(balloonLabel);
      return;
    }
    if (!visibleBalloonLabel) return;
    if (balloonHideTimerRef.current) {
      clearTimeout(balloonHideTimerRef.current);
    }
    balloonHideTimerRef.current = setTimeout(() => {
      setVisibleBalloonLabel(null);
      balloonHideTimerRef.current = null;
    }, BALLOON_HIDE_DURATION_MS);
  }, [balloonLabel, visibleBalloonLabel]);

  return (
    <VStack alignItems="center" gap={0}>
      <Box
        h={NOTEBOOK_LINE_HEIGHT}
        position="relative"
        w={NOTEBOOK_LINE_HEIGHT}
      >
        <Text
          aria-hidden="true"
          data-testid="notebook-like-balloon"
          fontSize="md"
          left="50%"
          m={0}
          opacity={balloonLabel ? 1 : 0}
          pointerEvents="none"
          position="absolute"
          top={`calc(${NOTEBOOK_LINE_HEIGHT} * -0.75)`}
          transform={
            balloonLabel ? "translate(-50%, 0)" : "translate(-50%, 0.45rem)"
          }
          transition="opacity 0.2s ease-out, transform 0.2s ease-out"
          whiteSpace="nowrap"
        >
          {renderedBalloonLabel}
        </Text>
        <IconButton
          aria-label={t("likeButtonAriaLabel")}
          aria-pressed={liked}
          disabled={status === "loading"}
          display="inline-flex"
          height={NOTEBOOK_LINE_HEIGHT}
          lineHeight="1"
          loading={status === "loading"}
          minW="auto"
          onBlur={() => setHovered(false)}
          onClick={handleLike}
          onFocus={handleHoverStart}
          onMouseEnter={handleHoverStart}
          onMouseLeave={() => setHovered(false)}
          p={0}
          rounded="full"
          size={"sm"}
          variant={liked ? "solid" : "outline"}
          width={NOTEBOOK_LINE_HEIGHT}
        >
          <LuThumbsUp />
        </IconButton>
      </Box>
      <Text m={0}>{countLabel}</Text>
    </VStack>
  );
};

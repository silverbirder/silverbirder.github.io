"use client";

import type { IconButtonProps } from "@chakra-ui/react";

import { IconButton, Text, VStack } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { LuThumbsUp } from "react-icons/lu";

import { NOTEBOOK_LINE_HEIGHT } from "./notebook-prose";

type Props = {
  disableAutoLoad?: boolean;
  initialCount?: number;
  initialStatus?: Status;
  name: string;
  namespace: string;
  size?: IconButtonProps["size"];
};

type Status = "error" | "idle" | "loading";

const API_BASE_URL = process.env.NEXT_PUBLIC_LIKES_API_URL ?? "";

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

export const NotebookLike = ({
  disableAutoLoad = false,
  initialCount,
  initialStatus = "idle",
  name,
  namespace,
  size = "sm",
}: Props) => {
  const t = useTranslations("ui.notebook");
  const [count, setCount] = useState<null | number>(initialCount ?? null);
  const [status, setStatus] = useState<Status>(() =>
    disableAutoLoad ? initialStatus : "loading",
  );
  const [liked, setLiked] = useState(false);
  const [anonId, setAnonId] = useState<null | string>(null);

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
    if (disableAutoLoad) return;
    let cancelled = false;

    const load = async () => {
      setStatus("loading");
      try {
        if (!API_BASE_URL) {
          throw new Error("NEXT_PUBLIC_LIKES_API_URL is not set");
        }
        const res = await fetch(buildApiUrl(name, anonId ?? undefined));
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
  }, [anonId, disableAutoLoad, name, namespace]);

  const handleLike = async () => {
    if (status === "loading") return;
    setStatus("loading");
    try {
      if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_LIKES_API_URL is not set");
      }
      if (!anonId) {
        throw new Error("anonId is not available");
      }
      const res = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/api/likes`, {
        body: JSON.stringify({ anonId, slug: name }),
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

  const countLabel = count ?? "-";

  return (
    <VStack alignItems="center" gap={0}>
      <IconButton
        aria-label={t("likeButtonAriaLabel")}
        aria-pressed={liked}
        disabled={status === "loading"}
        display="inline-flex"
        height={NOTEBOOK_LINE_HEIGHT}
        lineHeight="1"
        loading={status === "loading"}
        minW="auto"
        onClick={handleLike}
        p={0}
        rounded="full"
        size={size}
        variant={liked ? "solid" : "outline"}
        width={NOTEBOOK_LINE_HEIGHT}
      >
        <LuThumbsUp />
      </IconButton>
      <Text m={0}>{countLabel}</Text>
    </VStack>
  );
};

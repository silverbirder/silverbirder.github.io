"use client";

import { Box, chakra } from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";

type PostReference = {
  actor: string;
  postId: string;
};

type Props = {
  permalink: string;
};

const BLUESKY_EMBED_ORIGIN = "https://embed.bsky.app";
const BLUESKY_DEFAULT_HEIGHT = 220;
const BLUESKY_EMBED_MAX_WIDTH = "600px";
const BLUESKY_PUBLIC_API_ORIGIN = "https://public.api.bsky.app";

const resolvePostReference = (permalink: string): null | PostReference => {
  try {
    const url = new URL(permalink);
    const hostname = url.hostname.replace(/^www\./, "");
    if (hostname !== "bsky.app") {
      return null;
    }

    const match = url.pathname.match(/^\/profile\/([^/]+)\/post\/([^/]+)/);
    if (!match) {
      return null;
    }

    const actor = match[1];
    const postId = match[2];
    if (!actor || !postId) {
      return null;
    }

    return { actor, postId };
  } catch {
    return null;
  }
};

const resolveDid = async (actor: string) => {
  if (actor.startsWith("did:")) {
    return actor;
  }

  const url = new URL(
    `${BLUESKY_PUBLIC_API_ORIGIN}/xrpc/com.atproto.identity.resolveHandle`,
  );
  url.searchParams.set("handle", actor);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to resolve Bluesky handle: ${response.status}`);
  }

  const data = (await response.json()) as { did?: unknown };
  if (typeof data.did !== "string" || !data.did.startsWith("did:")) {
    throw new Error("Resolved Bluesky handle did not include a DID");
  }

  return data.did;
};

export const BlueskyEmbed = ({ permalink }: Props) => {
  const t = useTranslations("ui.blueskyEmbed");
  const embedId = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(BLUESKY_DEFAULT_HEIGHT);
  const [src, setSrc] = useState<null | string>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const postReference = resolvePostReference(permalink);
    if (!postReference) {
      setSrc(null);
      setHasError(true);
      return;
    }

    let ignore = false;
    setSrc(null);
    setHasError(false);

    void resolveDid(postReference.actor)
      .then((did) => {
        if (!ignore) {
          const url = new URL(
            `${BLUESKY_EMBED_ORIGIN}/embed/${did}/app.bsky.feed.post/${postReference.postId}`,
          );
          url.searchParams.set("colorMode", "system");
          url.searchParams.set("id", embedId);
          setSrc(url.toString());
          setHasError(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setSrc(null);
          setHasError(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, [embedId, permalink]);

  useEffect(() => {
    if (!src) {
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== BLUESKY_EMBED_ORIGIN) {
        return;
      }

      const data = event.data as undefined | { height?: unknown; id?: unknown };
      if (data?.id !== embedId) {
        return;
      }

      if (typeof data.height === "number" && Number.isFinite(data.height)) {
        const nextHeight = Math.max(data.height, BLUESKY_DEFAULT_HEIGHT);
        const lineHeight = ref.current
          ? Number.parseFloat(window.getComputedStyle(ref.current).lineHeight)
          : Number.NaN;

        setHeight(
          Number.isFinite(lineHeight) && lineHeight > 0
            ? Math.ceil(nextHeight / lineHeight) * lineHeight
            : nextHeight,
        );
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [embedId, src]);

  if (hasError) {
    return (
      <chakra.a className="not-prose" href={permalink}>
        {t("linkLabel")}
      </chakra.a>
    );
  }

  if (!src) {
    return <chakra.div aria-busy>{t("loading")}</chakra.div>;
  }

  return (
    <Box
      className="oembed-card not-prose"
      data-embed="bluesky"
      display="flow-root"
      lineHeight="var(--notebook-line-height)"
      marginInline="auto"
      maxWidth={BLUESKY_EMBED_MAX_WIDTH}
      ref={ref}
      width="100%"
    >
      <chakra.iframe
        border="0"
        data-bluesky-id={embedId}
        loading="lazy"
        scrolling="no"
        src={src}
        style={{ display: "block", height: `${height}px`, width: "100%" }}
        title={t("linkLabel")}
        width="100%"
      />
    </Box>
  );
};

"use client";

import { Box, chakra } from "@chakra-ui/react";
import { useEffect } from "react";

import { useNotebookLineGridPadding } from "./embed-grid";

type Props = {
  captioned?: boolean;
  permalink: string;
};

const INSTAGRAM_EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";
const INSTAGRAM_IFRAME_TITLE = "Instagram Embed";
const INSTAGRAM_LINK_LABEL = "Instagram";

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

export const InstagramEmbed = ({ captioned = true, permalink }: Props) => {
  const { paddingBottom, ref } = useNotebookLineGridPadding();

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }

    const applyIframeTitle = () => {
      root.querySelectorAll("iframe").forEach((iframe) => {
        if (!iframe.getAttribute("title")) {
          iframe.setAttribute("title", INSTAGRAM_IFRAME_TITLE);
        }
      });
    };

    const process = () => {
      window.instgrm?.Embeds?.process();
      applyIframeTitle();
    };

    applyIframeTitle();

    const observer =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(() => {
            applyIframeTitle();
          });
    observer?.observe(root, {
      childList: true,
      subtree: true,
    });

    if (window.instgrm?.Embeds) {
      process();
      return () => {
        observer?.disconnect();
      };
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${INSTAGRAM_EMBED_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", process, { once: true });
      return () => {
        observer?.disconnect();
        existingScript.removeEventListener("load", process);
      };
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = INSTAGRAM_EMBED_SCRIPT_SRC;
    script.addEventListener("load", process, { once: true });
    document.body.appendChild(script);

    return () => {
      observer?.disconnect();
      script.removeEventListener("load", process);
    };
  }, [permalink, ref]);

  return (
    <Box
      className="oembed-card not-prose"
      data-embed="instagram"
      lineHeight="var(--notebook-line-height)"
      paddingBottom={paddingBottom}
      ref={ref}
    >
      <chakra.blockquote
        className="instagram-media"
        data-instgrm-captioned={captioned ? "true" : undefined}
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        margin="0 auto"
        maxWidth="calc(var(--notebook-line-height) * 18)"
        minWidth="calc(var(--notebook-line-height) * 8)"
        width="calc(100% - 2px)"
      >
        <chakra.a href={permalink}>{INSTAGRAM_LINK_LABEL}</chakra.a>
      </chakra.blockquote>
    </Box>
  );
};

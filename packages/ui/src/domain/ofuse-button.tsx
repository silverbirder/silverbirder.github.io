"use client";

import { Box, chakra } from "@chakra-ui/react";
import { useEffect } from "react";

const OFUSE_WIDGET_SCRIPT_SRC = "https://ofuse.me/assets/platform/widget.js";

type Props = {
  id: string;
  label: string;
  style?: "rectangle" | "round";
  url: string;
};

export const OfuseButton = ({ id, label, style = "rectangle", url }: Props) => {
  useEffect(() => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${OFUSE_WIDGET_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = OFUSE_WIDGET_SCRIPT_SRC;

    document.body.appendChild(script);
  }, []);

  return (
    <Box
      alignItems="center"
      className="not-prose"
      data-testid="ofuse-widget-wrap"
      display="flex"
      minH="calc(var(--notebook-line-height) * 2)"
    >
      <chakra.a
        data-ofuse-id={id}
        data-ofuse-style={style}
        data-ofuse-widget-button
        href={url}
      >
        {label}
      </chakra.a>
    </Box>
  );
};

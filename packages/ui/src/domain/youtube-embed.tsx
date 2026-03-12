"use client";

import { Box, chakra } from "@chakra-ui/react";

type Props = {
  src: string;
  title?: string;
};

const YOUTUBE_EMBED_HEIGHT = "calc(var(--notebook-line-height) * 10)";
const YOUTUBE_EMBED_MAX_WIDTH = "calc(var(--notebook-line-height) * 18)";

export const YouTubeEmbed = ({ src, title = "YouTube Embed" }: Props) => {
  return (
    <Box
      className="oembed-card not-prose"
      data-embed="youtube"
      height={YOUTUBE_EMBED_HEIGHT}
      marginInline="auto"
      maxWidth={YOUTUBE_EMBED_MAX_WIDTH}
      width="100%"
    >
      <chakra.iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        border="0"
        height="100%"
        loading="lazy"
        src={src}
        title={title}
        width="100%"
      />
    </Box>
  );
};

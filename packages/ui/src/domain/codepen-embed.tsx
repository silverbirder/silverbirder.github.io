import { Box, chakra } from "@chakra-ui/react";

type Props = {
  src: string;
  title?: string;
};

export const CodepenEmbed = ({ src, title = "CodePen Embed" }: Props) => {
  return (
    <Box className="oembed-card not-prose" data-embed="codepen">
      <chakra.iframe
        allowFullScreen
        border="0"
        height="calc(var(--notebook-line-height) * 10)"
        loading="lazy"
        src={src}
        title={title}
        width="100%"
      />
    </Box>
  );
};

"use client";

import { Button, Icon } from "@chakra-ui/react";
import { SiBluesky } from "react-icons/si";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildBlueskyShareUrl = (url: string, text: string) => {
  const composedText = url ? `${text} ${url}` : text;
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(
    composedText,
  )}`;
};

export const ShareButtonBluesky = ({
  height,
  label,
  loading,
  loadingText,
  text,
  url,
  width,
}: Props) => {
  const href = buildBlueskyShareUrl(url, text);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  return (
    <Button
      _active={{ bg: "#0059c7" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#0068e6" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#007bff"
      borderRadius="full"
      color="white"
      h={buttonHeight}
      loading={loading}
      minW={buttonWidth}
      p={0}
      size="sm"
      variant="solid"
      w={buttonWidth}
    >
      <a href={href} rel="noopener noreferrer" target="_blank">
        <Icon size="sm">
          <SiBluesky />
        </Icon>
      </a>
    </Button>
  );
};

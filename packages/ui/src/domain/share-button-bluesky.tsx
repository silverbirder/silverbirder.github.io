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

  return (
    <Button
      _active={{ bg: "#007bff", borderColor: "#007bff", color: "white" }}
      _before={{
        bg: "#007bff",
        bottom: "1px",
        content: '""',
        left: 0,
        position: "absolute",
        top: "1px",
        width: "1px",
      }}
      _disabled={{ opacity: 1 }}
      _hover={{
        bg: "#007bff",
        borderColor: "#007bff",
        color: "white",
        textDecoration: "none",
      }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="transparent"
      borderRadius="none"
      color="fg"
      gap={2}
      h={buttonHeight}
      justifyContent="space-between"
      loading={loading}
      maxH={buttonHeight}
      minH={buttonHeight}
      minW={width ?? "fit-content"}
      position="relative"
      px={3}
      py={0}
      size="sm"
      textAlign="left"
      textDecoration="none"
      variant="ghost"
      w={width}
    >
      <a
        href={href}
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        target="_blank"
      >
        {label}
        <Icon color="#007bff" size="sm">
          <SiBluesky />
        </Icon>
      </a>
    </Button>
  );
};

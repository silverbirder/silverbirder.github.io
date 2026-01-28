"use client";

import { Button, Icon } from "@chakra-ui/react";
import { SiThreads } from "react-icons/si";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildThreadsShareUrl = (url: string, text: string) => {
  const params: string[] = [];
  if (text) {
    params.push(`text=${encodeURIComponent(text)}`);
  }
  if (url) {
    params.push(`url=${encodeURIComponent(url)}`);
  }
  return params.length > 0
    ? `https://www.threads.net/intent/post?${params.join("&")}`
    : "https://www.threads.net/intent/post";
};

export const ShareButtonThreads = ({
  height,
  label,
  loading,
  loadingText,
  text,
  url,
  width,
}: Props) => {
  const href = buildThreadsShareUrl(url, text);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  return (
    <Button
      _active={{ bg: "#2a2a2a" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#1a1a1a" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#101010"
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
          <SiThreads />
        </Icon>
      </a>
    </Button>
  );
};

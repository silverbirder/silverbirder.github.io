"use client";

import { Button, Icon } from "@chakra-ui/react";
import { FaXTwitter } from "react-icons/fa6";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildXShareUrl = (url: string, text: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
};

export const ShareButtonX = ({
  height,
  label,
  loading,
  loadingText,
  text,
  url,
  width,
}: Props) => {
  const href = buildXShareUrl(url, text);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  return (
    <Button
      _active={{ bg: "#1f1f1f" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#111111" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#000000"
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
          <FaXTwitter />
        </Icon>
      </a>
    </Button>
  );
};

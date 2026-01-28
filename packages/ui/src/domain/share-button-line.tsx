"use client";

import { Button, Icon } from "@chakra-ui/react";
import { SiLine } from "react-icons/si";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildLineShareUrl = (url: string) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
};

export const ShareButtonLine = ({
  height,
  label,
  loading,
  loadingText,
  url,
  width,
}: Props) => {
  const href = buildLineShareUrl(url);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  return (
    <Button
      _active={{ bg: "#049a40" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#05b34b" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#06c755"
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
          <SiLine />
        </Icon>
      </a>
    </Button>
  );
};

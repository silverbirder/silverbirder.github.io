"use client";

import { Button, Icon } from "@chakra-ui/react";
import { SiHatenabookmark } from "react-icons/si";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildHatenaShareUrl = (url: string, text: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(text);
  return `https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}&btitle=${encodedTitle}`;
};

export const ShareButtonHatena = ({
  height,
  label,
  loading,
  loadingText,
  text,
  url,
  width,
}: Props) => {
  const href = buildHatenaShareUrl(url, text);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  return (
    <Button
      _active={{ bg: "#007dab" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#0092c6" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#00a4de"
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
          <SiHatenabookmark />
        </Icon>
      </a>
    </Button>
  );
};

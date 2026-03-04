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

  return (
    <Button
      _active={{ bg: "#00a4de", borderColor: "#00a4de", color: "white" }}
      _before={{
        bg: "#00a4de",
        bottom: "1px",
        content: '""',
        left: 0,
        position: "absolute",
        top: "1px",
        width: "1px",
      }}
      _disabled={{ opacity: 1 }}
      _hover={{
        bg: "#00a4de",
        borderColor: "#00a4de",
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
        <Icon color="#00a4de" size="sm">
          <SiHatenabookmark />
        </Icon>
      </a>
    </Button>
  );
};

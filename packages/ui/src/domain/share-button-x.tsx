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

  return (
    <Button
      _active={{ bg: "fg", borderColor: "fg", color: "bg" }}
      _before={{
        bg: "fg",
        bottom: "1px",
        content: '""',
        left: 0,
        position: "absolute",
        top: "1px",
        width: "1px",
      }}
      _disabled={{ opacity: 1 }}
      _hover={{
        bg: "fg",
        borderColor: "fg",
        color: "bg",
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
        <Icon size="sm">
          <FaXTwitter />
        </Icon>
      </a>
    </Button>
  );
};

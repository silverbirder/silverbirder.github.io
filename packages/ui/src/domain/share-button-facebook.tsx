"use client";

import { Button, Icon } from "@chakra-ui/react";
import { SiFacebook } from "react-icons/si";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildFacebookShareUrl = (url: string) => {
  const encodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
};

export const ShareButtonFacebook = ({
  height,
  label,
  loading,
  loadingText,
  url,
  width,
}: Props) => {
  const href = buildFacebookShareUrl(url);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  return (
    <Button
      _active={{ bg: "#1158b0" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#1569d1" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#1877f2"
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
          <SiFacebook />
        </Icon>
      </a>
    </Button>
  );
};

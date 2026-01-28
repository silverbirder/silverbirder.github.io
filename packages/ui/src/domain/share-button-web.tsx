"use client";

import { Button, Icon } from "@chakra-ui/react";
import { MdShare } from "react-icons/md";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

export const ShareButtonWeb = ({
  height,
  label,
  loading,
  loadingText,
  text,
  url,
  width,
}: Props) => {
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  const handleClick = async () => {
    if (!url || typeof navigator === "undefined") {
      return;
    }

    if (!navigator.share) {
      return;
    }

    try {
      await navigator.share({ text, url });
    } catch {
      // ignore share failures
    }
  };

  return (
    <Button
      _active={{ bg: "#334155" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#1e293b" }}
      alignItems="center"
      aria-label={ariaLabel}
      bg="#0f172a"
      borderRadius="full"
      color="white"
      h={buttonHeight}
      loading={loading}
      minW={buttonWidth}
      onClick={handleClick}
      p={0}
      size="sm"
      type="button"
      variant="solid"
      w={buttonWidth}
    >
      <Icon size="sm">
        <MdShare />
      </Icon>
    </Button>
  );
};

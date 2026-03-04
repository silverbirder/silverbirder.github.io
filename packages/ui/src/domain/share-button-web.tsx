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
      onClick={handleClick}
      position="relative"
      px={3}
      py={0}
      size="sm"
      textAlign="left"
      textDecoration="none"
      type="button"
      variant="ghost"
      w={width}
    >
      {label}
      <Icon size="sm">
        <MdShare />
      </Icon>
    </Button>
  );
};

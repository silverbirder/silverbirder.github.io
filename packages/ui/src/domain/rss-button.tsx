"use client";

import type { ComponentProps } from "react";

import { Button, Icon } from "@chakra-ui/react";
import { MdRssFeed } from "react-icons/md";

type Props = {
  height?: ComponentProps<typeof Button>["h"];
  label: string;
  loading?: boolean;
  loadingText?: string;
  url: string;
  width?: ComponentProps<typeof Button>["w"];
};

export const RssButton = ({
  height = 9,
  label,
  loading,
  loadingText,
  url,
  width,
}: Props) => {
  const ariaLabel = loading && loadingText ? loadingText : label;

  return (
    <Button
      _active={{ bg: "#f97316", borderColor: "#f97316", color: "white" }}
      _before={{
        bg: "#f97316",
        bottom: "1px",
        content: '""',
        left: 0,
        position: "absolute",
        top: "1px",
        width: "1px",
      }}
      _disabled={{ opacity: 1 }}
      _hover={{
        bg: "#f97316",
        borderColor: "#f97316",
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
      h={height}
      justifyContent="space-between"
      loading={loading}
      maxH={height}
      minH={height}
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
        href={url}
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
        target="_blank"
      >
        {label}
        <Icon color="#f97316" size="sm">
          <MdRssFeed />
        </Icon>
      </a>
    </Button>
  );
};

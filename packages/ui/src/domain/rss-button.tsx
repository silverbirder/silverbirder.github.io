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
  width = 9,
}: Props) => {
  const ariaLabel = loading && loadingText ? loadingText : label;

  return (
    <Button
      _active={{ bg: "#c95410" }}
      _disabled={{ opacity: 1 }}
      _hover={{ bg: "#e46514" }}
      alignItems="center"
      aria-label={ariaLabel}
      asChild
      bg="#f97316"
      borderRadius="full"
      color="white"
      h={height}
      loading={loading}
      minW={width}
      p={0}
      size="sm"
      variant="solid"
      w={width}
    >
      <a href={url} rel="noopener noreferrer" target="_blank">
        <Icon size="sm">
          <MdRssFeed />
        </Icon>
      </a>
    </Button>
  );
};

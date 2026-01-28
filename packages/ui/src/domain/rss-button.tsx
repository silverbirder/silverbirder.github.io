"use client";

import { Button, Icon } from "@chakra-ui/react";
import { MdRssFeed } from "react-icons/md";

type Props = {
  label: string;
  loading?: boolean;
  loadingText?: string;
  url: string;
};

export const RssButton = ({ label, loading, loadingText, url }: Props) => {
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
      h={9}
      loading={loading}
      minW={9}
      p={0}
      size="sm"
      variant="solid"
      w={9}
    >
      <a href={url} rel="noopener noreferrer" target="_blank">
        <Icon size="sm">
          <MdRssFeed />
        </Icon>
      </a>
    </Button>
  );
};

"use client";

import { IconButton, Portal, Tooltip } from "@chakra-ui/react";
import { SiBluesky } from "react-icons/si";

type Props = {
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  text: string;
  url: string;
  width?: number | string;
};

const buildBlueskyShareUrl = (url: string, text: string) => {
  const composedText = url ? `${text} ${url}` : text;
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(
    composedText,
  )}`;
};

export const ShareButtonBluesky = ({
  height,
  label,
  loading,
  loadingText,
  text,
  url,
  width,
}: Props) => {
  const href = buildBlueskyShareUrl(url, text);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;

  return (
    <Tooltip.Root
      closeDelay={0}
      lazyMount
      openDelay={0}
      positioning={{ placement: "top" }}
    >
      <Tooltip.Trigger asChild>
        <IconButton
          _active={{ bg: "blue.100" }}
          _disabled={{ opacity: 1 }}
          _hover={{ bg: "blue.50", textDecoration: "none" }}
          aria-label={ariaLabel}
          asChild
          bg="transparent"
          color="#007bff"
          h={buttonHeight}
          loading={loading}
          minH={buttonHeight}
          minW={width ?? buttonHeight}
          rounded="full"
          size="sm"
          variant="ghost"
          w={width ?? buttonHeight}
        >
          <a
            href={href}
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
            target="_blank"
          >
            <SiBluesky aria-hidden focusable="false" role="presentation" />
          </a>
        </IconButton>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>
            <Tooltip.Arrow>
              <Tooltip.ArrowTip />
            </Tooltip.Arrow>
            {label}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};

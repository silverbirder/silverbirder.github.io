"use client";

import { IconButton, Portal, Tooltip } from "@chakra-ui/react";
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
    <Tooltip.Root
      closeDelay={0}
      lazyMount
      openDelay={0}
      positioning={{ placement: "top" }}
    >
      <Tooltip.Trigger asChild>
        <IconButton
          _active={{ bg: "blackAlpha.200" }}
          _disabled={{ opacity: 1 }}
          _hover={{ bg: "blackAlpha.100", textDecoration: "none" }}
          aria-label={ariaLabel}
          asChild
          bg="transparent"
          color="fg"
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
            <FaXTwitter aria-hidden focusable="false" role="presentation" />
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

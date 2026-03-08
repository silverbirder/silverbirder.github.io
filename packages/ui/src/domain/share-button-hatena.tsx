"use client";

import { IconButton, Portal, Tooltip } from "@chakra-ui/react";
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
          color="#00a4de"
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
            <SiHatenabookmark
              aria-hidden
              focusable="false"
              role="presentation"
            />
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

"use client";

import { IconButton, Portal, Tooltip } from "@chakra-ui/react";
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
          _hover={{ bg: "blackAlpha.100" }}
          aria-label={ariaLabel}
          bg="transparent"
          color="fg"
          h={buttonHeight}
          loading={loading}
          minH={buttonHeight}
          minW={width ?? buttonHeight}
          onClick={handleClick}
          rounded="full"
          size="sm"
          type="button"
          variant="ghost"
          w={width ?? buttonHeight}
        >
          <MdShare aria-hidden focusable="false" role="presentation" />
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

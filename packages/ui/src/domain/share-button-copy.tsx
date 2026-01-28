"use client";

import { Button, Icon, Portal, Tooltip } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { MdCheck, MdContentCopy } from "react-icons/md";

type Props = {
  copiedLabel: string;
  height?: number | string;
  label: string;
  loading?: boolean;
  loadingText?: string;
  url: string;
  width?: number | string;
};

export const ShareButtonCopy = ({
  copiedLabel,
  height,
  label,
  loading,
  loadingText,
  url,
  width,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<null | number>(null);
  const ariaLabel = loading && loadingText ? loadingText : label;
  const buttonHeight = height ?? 9;
  const buttonWidth = width ?? 9;

  const handleClick = async () => {
    if (!url || typeof navigator === "undefined") {
      return;
    }
    const { clipboard } = navigator;
    if (!clipboard?.writeText) {
      return;
    }

    try {
      setCopied(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setCopied(false);
        timeoutRef.current = null;
      }, 2000);
      await clipboard.writeText(url);
    } catch {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setCopied(false);
      // ignore clipboard failures
    }
  };

  return (
    <Tooltip.Root
      closeDelay={0}
      lazyMount
      open={copied}
      openDelay={0}
      positioning={{ placement: "top" }}
      unmountOnExit
    >
      <Tooltip.Trigger asChild>
        <Button
          _active={{ bg: "gray.700" }}
          _disabled={{ opacity: 1 }}
          _hover={{ bg: "gray.800" }}
          alignItems="center"
          aria-label={ariaLabel}
          bg="gray.900"
          borderRadius="full"
          color="white"
          data-copied={copied ? "true" : "false"}
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
          <Icon size="sm">{copied ? <MdCheck /> : <MdContentCopy />}</Icon>
        </Button>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>
            <Tooltip.Arrow>
              <Tooltip.ArrowTip />
            </Tooltip.Arrow>
            {copiedLabel}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};

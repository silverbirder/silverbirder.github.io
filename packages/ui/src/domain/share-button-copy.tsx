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
          data-copied={copied ? "true" : "false"}
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

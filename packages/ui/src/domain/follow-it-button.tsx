"use client";

import type { ComponentProps } from "react";

import { Button, Image } from "@chakra-ui/react";

const FOLLOW_IT_ICON_SRC = "/follow-it/svg/Round_Green.svg";

type Props = {
  height?: ComponentProps<typeof Button>["h"];
  label: string;
  url: string;
  width?: ComponentProps<typeof Button>["w"];
};

export const FollowItButton = ({ height = 9, label, url, width }: Props) => {
  return (
    <Button
      _active={{ bg: "#00cf8d", borderColor: "#00cf8d", color: "white" }}
      _before={{
        bg: "#00cf8d",
        bottom: "1px",
        content: '""',
        left: 0,
        position: "absolute",
        top: "1px",
        width: "1px",
      }}
      _hover={{
        bg: "#00cf8d",
        borderColor: "#00cf8d",
        color: "white",
        textDecoration: "none",
      }}
      alignItems="center"
      aria-label={label}
      asChild
      bg="transparent"
      borderRadius="none"
      className="not-prose"
      color="fg"
      gap={2}
      h={height}
      justifyContent="space-between"
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
        <Image alt="" aria-hidden boxSize="1rem" src={FOLLOW_IT_ICON_SRC} />
      </a>
    </Button>
  );
};

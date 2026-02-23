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

export const FollowItButton = ({
  height = 9,
  label,
  url,
  width = 9,
}: Props) => {
  return (
    <Button
      _active={{ opacity: 0.9 }}
      _hover={{ opacity: 0.9 }}
      alignItems="center"
      aria-label={label}
      asChild
      bg="transparent"
      borderRadius="full"
      className="not-prose"
      color="white"
      h={height}
      minW={width}
      p={0}
      size="sm"
      variant="solid"
      w={width}
    >
      <a href={url} rel="noopener noreferrer" target="_blank">
        <Image
          alt=""
          aria-hidden
          height={height}
          minH={height}
          minW={width}
          src={FOLLOW_IT_ICON_SRC}
          width={width}
        />
      </a>
    </Button>
  );
};

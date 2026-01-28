"use client";

import type { HTMLChakraProps } from "@chakra-ui/react";

import { chakra } from "@chakra-ui/react";

type Props = HTMLChakraProps<"div">;

export const CellophaneTape = (props: Props) => {
  return (
    <chakra.div
      aria-hidden="true"
      backdropFilter="blur(1px)"
      bg="green.subtle"
      border="1px solid"
      borderColor="green.subtle"
      data-testid="cellophane-tape"
      display="block"
      opacity={0.6}
      position="relative"
      {...props}
    />
  );
};

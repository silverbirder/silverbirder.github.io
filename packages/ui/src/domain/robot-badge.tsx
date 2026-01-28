"use client";

import type { ComponentProps } from "react";

import { Box } from "@chakra-ui/react";
import { FaCircle, FaRobot, FaXmark } from "react-icons/fa6";

type Props = Omit<ComponentProps<typeof Box>, "children"> & {
  status: "index" | "noindex";
};

export const RobotBadge = ({ status, ...props }: Props) => {
  const isNoIndex = status === "noindex";

  return (
    <Box aria-hidden="true" {...props}>
      <Box color="green.fg" h="full" position="relative" w="full">
        <Box as={FaRobot} h="full" w="full" />
        <Box
          alignItems="center"
          bg="bg"
          borderRadius="full"
          bottom="-2px"
          boxShadow="sm"
          data-index-status={status}
          display="flex"
          height="12px"
          justifyContent="center"
          position="absolute"
          right="-2px"
          width="12px"
        >
          <Box
            as={isNoIndex ? FaXmark : FaCircle}
            color={isNoIndex ? "fg.error" : "fg.success"}
            h="8px"
            w="8px"
          />
        </Box>
      </Box>
    </Box>
  );
};

"use client";

import type { ReactNode } from "react";

import { Box, Container } from "@chakra-ui/react";

import { NOTEBOOK_LINE_HEIGHT } from "./notebook-prose";

type Props = {
  children: ReactNode;
};

export const UserLayout = ({ children }: Props) => {
  return (
    <Box bg="bg.muted" minH="100dvh">
      <Container
        centerContent
        maxW="6xl"
        py={`calc(${NOTEBOOK_LINE_HEIGHT} * 1.5)`}
      >
        {children}
      </Container>
    </Box>
  );
};

"use client";

import { Box, Container, Stack } from "@chakra-ui/react";
import { Link as UiLink } from "@repo/ui";
import { useTranslations } from "next-intl";

const linkButton = {
  alignItems: "center",
  borderRadius: "0.75rem",
  color: "white",
  display: "inline-flex",
  fontSize: "0.95rem",
  fontWeight: "600",
  gap: "0.4rem",
  paddingBlock: "0.6rem",
  paddingInline: "1.2rem",
  textDecoration: "none",
  transition: "background 0.2s ease",
} as const;

export const Top = () => {
  const t = useTranslations("admin.home");

  return (
    <Box as="main" bg="bg" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <Stack align="center" gap={6}>
          <UiLink
            {...linkButton}
            data-testid="admin-new-post-link"
            href="/posts/new"
          >
            {t("newPostAction")}
          </UiLink>
        </Stack>
      </Container>
    </Box>
  );
};

"use client";

import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as UiLink } from "@repo/ui";
import { useTranslations } from "next-intl";

type Props = {
  name?: null | string;
  onSignOut: () => Promise<void>;
  posts: string[];
};

const baseLinkButton = {
  alignItems: "center",
  display: "inline-flex",
  fontWeight: "600",
  gap: "0.4rem",
  textDecoration: "none",
} as const;

export const Top = ({ name, onSignOut, posts }: Props) => {
  const t = useTranslations("admin.home");
  const displayName = name ? name : t("unknownUser");
  const signedInAs = t("signedInAs", { name: displayName });
  const hasPosts = posts.length > 0;

  return (
    <Box as="main" bg="bg" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <Stack gap={{ base: 8, md: 10 }}>
          <Box
            bg="green.subtle"
            borderColor="green.muted"
            borderRadius="2xl"
            borderWidth="1px"
            overflow="hidden"
            position="relative"
            px={{ base: 6, md: 10 }}
            py={{ base: 7, md: 9 }}
          >
            <Box
              aria-hidden="true"
              bgGradient="radial(green.200 0%, transparent 70%)"
              height="320px"
              inset="-30% auto auto -10%"
              opacity={0.5}
              position="absolute"
              width="320px"
            />
            <Box
              aria-hidden="true"
              bgGradient="radial(green.200 0%, transparent 70%)"
              height="360px"
              inset="auto -20% -40% auto"
              opacity={0.35}
              position="absolute"
              width="360px"
            />
            <Stack gap={4} position="relative">
              <Badge
                alignSelf="flex-start"
                bg="green.muted"
                borderRadius="999px"
                color="green.fg"
                fontSize="0.7rem"
                letterSpacing="0.2em"
                px={3}
                py={1}
              >
                {t("welcomeBadge")}
              </Badge>
              <Heading
                as="h1"
                color="green.fg"
                fontSize={{ base: "2.2rem", md: "2.8rem" }}
                letterSpacing="-0.02em"
              >
                {t("title")}
              </Heading>
              <Text color="fg.muted" fontSize="md">
                {signedInAs}
              </Text>
              <HStack flexWrap="wrap" gap={3} pt={2}>
                <UiLink
                  {...baseLinkButton}
                  _hover={{ background: "green.focusRing" }}
                  background="green.solid"
                  borderRadius="0.75rem"
                  color="white"
                  data-testid="admin-new-post-link"
                  fontSize="0.95rem"
                  href="/posts/new"
                  paddingBlock="0.6rem"
                  paddingInline="1.2rem"
                  transition="background 0.2s ease"
                >
                  {t("newPostAction")}
                </UiLink>
                <form>
                  <Button
                    as="button"
                    borderColor="green.muted"
                    color="green.fg"
                    formAction={onSignOut}
                    type="submit"
                    variant="outline"
                  >
                    {t("signOut")}
                  </Button>
                </form>
              </HStack>
              <Text color="fg.muted" fontSize="sm">
                {t("heroDescription")}
              </Text>
            </Stack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Box
              bg="bg"
              borderColor="green.muted"
              borderRadius="xl"
              borderWidth="1px"
              px={5}
              py={4}
            >
              <Text color="fg.muted" fontSize="xs" letterSpacing="0.2em">
                {t("metricPostsLabel")}
              </Text>
              <Text color="green.fg" fontSize="2xl" fontWeight="700">
                {posts.length}
              </Text>
            </Box>
            <Box
              bg="bg"
              borderColor="green.muted"
              borderRadius="xl"
              borderWidth="1px"
              px={5}
              py={4}
            >
              <Text color="fg.muted" fontSize="xs" letterSpacing="0.2em">
                {t("metricDraftsLabel")}
              </Text>
              <Text color="green.fg" fontSize="2xl" fontWeight="700">
                {t("metricDraftsValue")}
              </Text>
            </Box>
            <Box
              bg="bg"
              borderColor="green.muted"
              borderRadius="xl"
              borderWidth="1px"
              px={5}
              py={4}
            >
              <Text color="fg.muted" fontSize="xs" letterSpacing="0.2em">
                {t("metricUpdatedLabel")}
              </Text>
              <Text color="green.fg" fontSize="2xl" fontWeight="700">
                {t("metricUpdatedValue")}
              </Text>
            </Box>
          </SimpleGrid>

          <Box
            bg="bg"
            borderColor="green.muted"
            borderRadius="2xl"
            borderWidth="1px"
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 7 }}
          >
            <Flex
              align="center"
              gap={3}
              justify="space-between"
              mb={4}
              wrap="wrap"
            >
              <Heading color="green.fg" fontSize="lg">
                {t("postsTitle")}
              </Heading>
              <UiLink
                {...baseLinkButton}
                _hover={{ background: "green.subtle" }}
                border="1px solid"
                borderColor="green.muted"
                borderRadius="0.75rem"
                color="green.fg"
                fontSize="0.85rem"
                href="/posts/new"
                paddingBlock="0.4rem"
                paddingInline="1rem"
                transition="background 0.2s ease"
              >
                {t("postsCreateAction")}
              </UiLink>
            </Flex>
            <Box borderColor="green.muted" borderTop="1px solid" mb={4} />
            {hasPosts ? (
              <VStack align="stretch" as="ul" gap={3} listStyleType="none">
                {posts.map((post) => {
                  const slug = post.replace(/\.md$/i, "");
                  return (
                    <Box
                      as="li"
                      bg="bg"
                      borderColor="green.muted"
                      borderRadius="lg"
                      borderWidth="1px"
                      key={post}
                      px={4}
                      py={3}
                    >
                      <Flex align="center" gap={3} justify="space-between">
                        <Text
                          color="fg"
                          data-testid="post-name"
                          fontWeight="600"
                        >
                          {post}
                        </Text>
                        <UiLink
                          {...baseLinkButton}
                          _hover={{ background: "green.subtle" }}
                          border="1px solid"
                          borderColor="green.muted"
                          borderRadius="0.6rem"
                          color="green.fg"
                          fontSize="0.8rem"
                          href={`/posts/${slug}`}
                          paddingBlock="0.3rem"
                          paddingInline="0.8rem"
                          transition="background 0.2s ease"
                        >
                          {t("postsEditAction")}
                        </UiLink>
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            ) : (
              <Text color="fg.muted">{t("postsEmpty")}</Text>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

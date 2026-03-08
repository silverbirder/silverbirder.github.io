"use client";

import {
  Avatar,
  Box,
  Heading,
  HStack,
  IconButton,
  Image,
  Portal,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { CellophaneTape, type FollowLinks, Link, Notebook } from "@repo/ui";
import { buildSitePath } from "@repo/util";
import { useTranslations } from "next-intl";
import NextImage from "next/image";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";

import { ArtifactsSection } from "./artifacts";
import { SkillsSection } from "./skills-section";
import { WorkExperienceTimeline } from "./work-experience-timeline";

type Props = {
  followLinks: FollowLinks;
};
const photoMoreLink = "https://silverbirder-cork-board.vercel.app";
const featuredPhotoUrl =
  "https://res.cloudinary.com/silverbirder/image/upload/v1769605903/silver-birder.github.io/blog/kyoto.jpg";
const featuredPhotoLineCount = 10;
const featuredPhotoLineCountMobile = 7;

export const Me = ({ followLinks }: Props) => {
  const t = useTranslations("user.me");
  const followIconSize = "var(--notebook-line-height)";

  return (
    <Box w="full">
      <Notebook navigation={{}} relatedPosts={[]} tags={[]} title={t("title")}>
        <Box mt={`var(--notebook-line-height)`} mx="auto">
          <Stack gap={0}>
            <VStack gap={0} maxW="34rem" mx="auto" textAlign="center" w="full">
              <Box position="relative">
                <Avatar.Root
                  bg="bg"
                  className="not-prose"
                  shape="full"
                  size="2xl"
                >
                  <Avatar.Image
                    alt={t("name")}
                    src={`${buildSitePath(`assets/logo.png`)}`}
                  />
                  <Avatar.Fallback name={t("name")} />
                </Avatar.Root>
                <Box
                  alignItems="flex-start"
                  display="flex"
                  fontSize="2xs"
                  lineHeight="1.2"
                  position="absolute"
                  right="-30px"
                  top="-30px"
                >
                  <Box mt="0.6rem" writingMode="vertical-rl">
                    {t("greetingSecond")}
                  </Box>
                  <Box writingMode="vertical-rl">{t("greetingFirst")}</Box>
                </Box>
              </Box>
              <VStack gap={0} textAlign="center">
                <Heading as="h2" my={0}>
                  {t("name")}
                </Heading>
                <Text my={0}>{t("role")}</Text>
                <HStack gap={1}>
                  <Tooltip.Root
                    closeDelay={0}
                    lazyMount
                    openDelay={0}
                    positioning={{ placement: "top" }}
                  >
                    <Tooltip.Trigger asChild>
                      <IconButton
                        aria-label={t("followXLabel")}
                        asChild
                        h={followIconSize}
                        minH={followIconSize}
                        minW={followIconSize}
                        rounded="full"
                        size="sm"
                        variant="ghost"
                        w={followIconSize}
                      >
                        <a
                          href={followLinks.x}
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                          target="_blank"
                        >
                          <FaXTwitter
                            aria-hidden
                            focusable="false"
                            role="presentation"
                          />
                        </a>
                      </IconButton>
                    </Tooltip.Trigger>
                    <Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Content>
                          <Tooltip.Arrow>
                            <Tooltip.ArrowTip />
                          </Tooltip.Arrow>
                          {t("followXLabel")}
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Portal>
                  </Tooltip.Root>
                  <Tooltip.Root
                    closeDelay={0}
                    lazyMount
                    openDelay={0}
                    positioning={{ placement: "top" }}
                  >
                    <Tooltip.Trigger asChild>
                      <IconButton
                        aria-label={t("followBlueskyLabel")}
                        asChild
                        color="#007bff"
                        h={followIconSize}
                        minH={followIconSize}
                        minW={followIconSize}
                        rounded="full"
                        size="sm"
                        variant="ghost"
                        w={followIconSize}
                      >
                        <a
                          href={followLinks.bluesky}
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                          target="_blank"
                        >
                          <SiBluesky
                            aria-hidden
                            focusable="false"
                            role="presentation"
                          />
                        </a>
                      </IconButton>
                    </Tooltip.Trigger>
                    <Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Content>
                          <Tooltip.Arrow>
                            <Tooltip.ArrowTip />
                          </Tooltip.Arrow>
                          {t("followBlueskyLabel")}
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Portal>
                  </Tooltip.Root>
                  <Tooltip.Root
                    closeDelay={0}
                    lazyMount
                    openDelay={0}
                    positioning={{ placement: "top" }}
                  >
                    <Tooltip.Trigger asChild>
                      <IconButton
                        aria-label={t("followGithubLabel")}
                        asChild
                        h={followIconSize}
                        minH={followIconSize}
                        minW={followIconSize}
                        rounded="full"
                        size="sm"
                        variant="ghost"
                        w={followIconSize}
                      >
                        <a
                          href={followLinks.github}
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none" }}
                          target="_blank"
                        >
                          <FaGithub
                            aria-hidden
                            focusable="false"
                            role="presentation"
                          />
                        </a>
                      </IconButton>
                    </Tooltip.Trigger>
                    <Portal>
                      <Tooltip.Positioner>
                        <Tooltip.Content>
                          <Tooltip.Arrow>
                            <Tooltip.ArrowTip />
                          </Tooltip.Arrow>
                          {t("followGithubLabel")}
                        </Tooltip.Content>
                      </Tooltip.Positioner>
                    </Portal>
                  </Tooltip.Root>
                </HStack>
              </VStack>
            </VStack>
            <Stack gap={0} maxW="34rem" mx="auto" textAlign="left" w="full">
              <Text mb={0}>{t("leadFirst")}</Text>
              <Text my={0}>{t("leadSecond")}</Text>
              <Text mb={0}>{t("detailFirst")}</Text>
              <Text my={0}>
                {t.rich("detailSecond", {
                  link: (chunks) => (
                    <Link
                      href={photoMoreLink}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </Text>
              <Box
                as="figure"
                lineHeight="var(--notebook-line-height)"
                marginInline="auto"
                marginX={0}
                marginY="var(--notebook-line-height)"
                position="relative"
                width="fit-content"
              >
                <CellophaneTape
                  height="calc(var(--notebook-line-height) * 0.75)"
                  left="calc(var(--notebook-line-height) * -0.55)"
                  pointerEvents="none"
                  position="absolute"
                  top="calc(var(--notebook-line-height) * -0.45)"
                  transform="rotate(-14deg)"
                  width="calc(var(--notebook-line-height) * 2.2)"
                  zIndex={1}
                />
                <CellophaneTape
                  height="calc(var(--notebook-line-height) * 0.75)"
                  pointerEvents="none"
                  position="absolute"
                  right="calc(var(--notebook-line-height) * -0.55)"
                  top="calc(var(--notebook-line-height) * -0.45)"
                  transform="rotate(14deg) scaleX(-1)"
                  width="calc(var(--notebook-line-height) * 2.2)"
                  zIndex={1}
                />
                <Image
                  asChild
                  borderRadius="0"
                  display="block"
                  h={{
                    base: `calc(var(--notebook-line-height) * ${featuredPhotoLineCountMobile})`,
                    md: `calc(var(--notebook-line-height) * ${featuredPhotoLineCount})`,
                  }}
                  marginX="auto"
                  marginY="0"
                  maxWidth="100%"
                >
                  <NextImage
                    alt={t("photoAlt")}
                    height={750}
                    loading="lazy"
                    sizes="(min-width: 48em) 34rem, 100vw"
                    src={featuredPhotoUrl}
                    width={1000}
                  />
                </Image>
                <Text
                  as="figcaption"
                  color="fg.muted"
                  lineHeight="var(--notebook-line-height)"
                  textAlign="center"
                >
                  {t("photoAlt")}
                </Text>
              </Box>
            </Stack>
            <WorkExperienceTimeline />
            <ArtifactsSection />
            <SkillsSection />
          </Stack>
        </Box>
      </Notebook>
    </Box>
  );
};

"use client";

import {
  Avatar,
  Box,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  createFollowSection,
  type FollowLinks,
  Link,
  Notebook,
} from "@repo/ui";
import { buildSitePath } from "@repo/util";
import { useTranslations } from "next-intl";
import NextImage from "next/image";

import { ArtifactsSection } from "./artifacts";
import { SkillsSection } from "./skills-section";
import { WorkExperienceTimeline } from "./work-experience-timeline";

type Props = {
  followLinks: FollowLinks;
};
const photoMoreLink = "https://silverbirder-cork-board.vercel.app";
const featuredPhotoUrl =
  "https://res.cloudinary.com/silverbirder/image/upload/v1729856266/silver-birder.github.io/my-photo/photo-38.png";
const featuredPhotoLineCount = 10;
const featuredPhotoLineCountMobile = 7;

export const Me = ({ followLinks }: Props) => {
  const t = useTranslations("user.me");
  const tBlog = useTranslations("user.blog");
  const follow = createFollowSection({
    labels: {
      bluesky: tBlog("followBlueskyLabel"),
      github: tBlog("followGithubLabel"),
      heading: t("followHeading"),
      rss: tBlog("followRssLabel"),
      threads: tBlog("followThreadsLabel"),
      x: tBlog("followXLabel"),
    },
    links: followLinks,
  });

  return (
    <Box w="full">
      <Notebook
        follow={follow}
        navigation={{}}
        relatedPosts={[]}
        tags={[]}
        title={t("title")}
      >
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
                  {t("handle")}
                </Heading>
                <Text my={0}>{t("role")}</Text>
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
                marginX={0}
                marginY="var(--notebook-line-height)"
              >
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

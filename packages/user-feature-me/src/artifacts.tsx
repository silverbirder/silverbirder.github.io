"use client";

import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@repo/ui";
import { useTranslations } from "next-intl";
import NextImage from "next/image";

export const ArtifactsSection = () => {
  const t = useTranslations("user.me");
  const artifacts = {
    books: [
      {
        image:
          "https://res.cloudinary.com/silverbirder/image/upload/v1696334257/silver-birder.github.io/artifacts/Introduction-to-webcomponents-for-beginners.jpg",
        link: "https://www.amazon.co.jp/gp/product/B08CY2QCFV/",
        title: t("artifacts.books.introWebComponents.title"),
      },
    ],
    githubProjects: [
      {
        description: t("artifacts.githubProjects.oEmbed.description"),
        link: "https://www.webcomponents.org/element/silverbirder/o-embed",
        name: t("artifacts.githubProjects.oEmbed.name"),
      },
      {
        description: t("artifacts.githubProjects.ogpMe.description"),
        link: "https://www.webcomponents.org/element/silverbirder/ogp-me",
        name: t("artifacts.githubProjects.ogpMe.name"),
      },
      {
        description: t(
          "artifacts.githubProjects.googleAccountPhotoApi.description",
        ),
        link: "https://github.com/silverbirder/Google-Account-Photo-API",
        name: t("artifacts.githubProjects.googleAccountPhotoApi.name"),
      },
      {
        description: t("artifacts.githubProjects.caat.description"),
        link: "https://github.com/silverbirder/CaAT",
        name: t("artifacts.githubProjects.caat.name"),
      },
      {
        description: t("artifacts.githubProjects.cotlin.description"),
        link: "https://github.com/silverbirder/Cotlin",
        name: t("artifacts.githubProjects.cotlin.name"),
      },
      {
        description: t("artifacts.githubProjects.rMinc.description"),
        link: "https://github.com/silverbirder/rMinc",
        name: t("artifacts.githubProjects.rMinc.name"),
      },
      {
        description: t("artifacts.githubProjects.tiqav2.description"),
        link: "https://github.com/silverbirder/tiqav2",
        name: t("artifacts.githubProjects.tiqav2.name"),
      },
      {
        description: t(
          "artifacts.githubProjects.zoomMeetingCreator.description",
        ),
        link: "https://github.com/silverbirder/zoom-meeting-creator",
        name: t("artifacts.githubProjects.zoomMeetingCreator.name"),
      },
    ],
  } as const;
  const notableContent = [
    {
      description: t(
        "artifacts.notableContent.items.cleanArchitecture.description",
      ),
      link: "https://www.slideshare.net/slideshow/ss-150331504/150331504",
      title: t("artifacts.notableContent.items.cleanArchitecture.title"),
      type: t("artifacts.notableContent.items.cleanArchitecture.type"),
    },
    {
      description: t(
        "artifacts.notableContent.items.techSelection.description",
      ),
      link: "https://tech-blog.monotaro.com/entry/2021/06/03/090000",
      title: t("artifacts.notableContent.items.techSelection.title"),
      type: t("artifacts.notableContent.items.techSelection.type"),
    },
    {
      description: t(
        "artifacts.notableContent.items.layeredArchitecture.description",
      ),
      link: "https://zenn.dev/moneyforward/articles/e97dd1c0412071",
      title: t("artifacts.notableContent.items.layeredArchitecture.title"),
      type: t("artifacts.notableContent.items.layeredArchitecture.type"),
    },
    {
      description: t(
        "artifacts.notableContent.items.testPatternGuide.description",
      ),
      link: "https://zenn.dev/silverbirder/articles/c3de04c9e6dd58",
      title: t("artifacts.notableContent.items.testPatternGuide.title"),
      type: t("artifacts.notableContent.items.testPatternGuide.type"),
    },
  ] as const;

  return (
    <Stack gap={0} maxW="34rem" mx="auto" w="full">
      <Heading as="h2" mb={0}>
        {t("artifacts.heading")}
      </Heading>
      <Heading as="h3" lineHeight="var(--notebook-line-height)" mb={0}>
        {t("artifacts.booksHeading")}
      </Heading>
      <Stack gap={0}>
        {artifacts.books.map((book) => (
          <Box as="figure" key={book.link} marginX={0} width="fit">
            <Image
              asChild
              borderColor="border.muted"
              borderRadius="0"
              borderStyle="solid"
              borderWidth="1px"
              display="block"
              h={{
                base: "calc(var(--notebook-line-height) * 5)",
                md: "calc(var(--notebook-line-height) * 6)",
              }}
              marginX="0"
              marginY="0"
              maxWidth="100%"
              objectFit="contain"
              width="auto"
            >
              <NextImage
                alt={book.title}
                height={1500}
                loading="lazy"
                src={book.image}
                width={1057}
              />
            </Image>
            <Text
              as="figcaption"
              lineHeight="var(--notebook-line-height)"
              textAlign="center"
            >
              <Link href={book.link}>{book.title}</Link>
            </Text>
          </Box>
        ))}
      </Stack>
      <Heading as="h3" lineHeight="var(--notebook-line-height)">
        {t("artifacts.webServicesHeading")}
      </Heading>
      <Link href={t("artifacts.webServicesLink")}>
        {t("artifacts.webServicesLinkLabel")}
      </Link>
      <Heading as="h3" lineHeight="var(--notebook-line-height)" mb={0}>
        {t("artifacts.githubHeading")}
      </Heading>
      <Stack as="ul" gap={0}>
        {artifacts.githubProjects.map((project) => (
          <Box as="li" key={project.link}>
            <HStack alignItems="flex-start" gap={0}>
              <Link href={project.link}>{project.name}</Link>
            </HStack>
            <Stack as="ul" gap={0}>
              <Text as="li">{project.description}</Text>
            </Stack>
          </Box>
        ))}
      </Stack>
      <Heading
        as="h2"
        lineHeight="var(--notebook-line-height)"
        mb={`var(--notebook-line-height)`}
      >
        {t("artifacts.notableContent.heading")}
      </Heading>
      <Stack gap={`var(--notebook-line-height)`}>
        {notableContent.map((content) => (
          <VStack
            alignItems="flex-start"
            bg="green.subtle"
            borderRadius="md"
            gap={0}
            key={content.link}
            m={0}
            p={`var(--notebook-line-height)`}
          >
            <Text color="fg" fontWeight="bold" my={0}>
              {content.title}
            </Text>
            <Text color="fg.muted" fontSize="sm" my={0}>
              {content.description}
            </Text>
            <HStack justifyContent="space-between" w="full">
              <Box
                alignItems="center"
                display="inline-flex"
                height="var(--notebook-line-height)"
                justifyContent="center"
              >
                <Badge
                  colorPalette="green"
                  height="calc(var(--notebook-line-height) * 0.75)"
                  lineHeight="1"
                  size="sm"
                  variant="outline"
                >
                  {content.type}
                </Badge>
              </Box>
              <Link href={content.link}>
                {t("artifacts.notableContent.moreLabel")}
              </Link>
            </HStack>
          </VStack>
        ))}
      </Stack>
    </Stack>
  );
};

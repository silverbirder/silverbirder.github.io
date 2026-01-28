"use client";

import {
  Box,
  Heading,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";

type Skill = {
  description: string;
  iconSrc: string;
  key: string;
  name: string;
};

type TechIconProps = {
  skill: Skill;
};

const TechIcon = ({ skill }: TechIconProps) => {
  return (
    <VStack alignItems="flex-start" className="not-prose" gap={0} p={0}>
      <HStack gap={2}>
        <Box
          height="var(--notebook-line-height)"
          width="var(--notebook-line-height)"
        >
          <Image alt={skill.name} my={0} src={skill.iconSrc} />
        </Box>
        <Text
          color="fg"
          fontWeight="bold"
          lineHeight="var(--notebook-line-height)"
        >
          {skill.name}
        </Text>
      </HStack>
      <Text
        color="fg.muted"
        fontSize="sm"
        lineHeight="var(--notebook-line-height)"
      >
        {skill.description}
      </Text>
    </VStack>
  );
};

export const SkillsSection = () => {
  const t = useTranslations("user.me");
  const iconSources = {
    figma: new URL("./icons/LogosFigma.svg", import.meta.url).toString(),
    jest: new URL("./icons/LogosJest.svg", import.meta.url).toString(),
    playwright: new URL(
      "./icons/LogosPlaywright.svg",
      import.meta.url,
    ).toString(),
    react: new URL("./icons/LogosReact.svg", import.meta.url).toString(),
    storybook: new URL(
      "./icons/LogosStorybookIcon.svg",
      import.meta.url,
    ).toString(),
    testcontainers: new URL(
      "./icons/testcontainers.png",
      import.meta.url,
    ).toString(),
  } as const;
  const topSkills: Skill[] = [
    {
      description: t("skills.items.react.description"),
      iconSrc: iconSources.react,
      key: "react",
      name: t("skills.items.react.name"),
    },
    {
      description: t("skills.items.jest.description"),
      iconSrc: iconSources.jest,
      key: "jest",
      name: t("skills.items.jest.name"),
    },
    {
      description: t("skills.items.playwright.description"),
      iconSrc: iconSources.playwright,
      key: "playwright",
      name: t("skills.items.playwright.name"),
    },
    {
      description: t("skills.items.testcontainers.description"),
      iconSrc: iconSources.testcontainers,
      key: "testcontainers",
      name: t("skills.items.testcontainers.name"),
    },
    {
      description: t("skills.items.storybook.description"),
      iconSrc: iconSources.storybook,
      key: "storybook",
      name: t("skills.items.storybook.name"),
    },
    {
      description: t("skills.items.figma.description"),
      iconSrc: iconSources.figma,
      key: "figma",
      name: t("skills.items.figma.name"),
    },
  ];

  return (
    <Stack gap={0} maxW="34rem" mx="auto" w="full">
      <Heading as="h2" lineHeight="var(--notebook-line-height)">
        {t("skills.heading")}
      </Heading>
      <VStack
        alignItems="flex-start"
        gap={`var(--notebook-line-height)`}
        w="full"
      >
        {topSkills.map((skill) => (
          <TechIcon key={skill.key} skill={skill} />
        ))}
      </VStack>
    </Stack>
  );
};

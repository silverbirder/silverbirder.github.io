"use client";

import {
  Badge,
  Box,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  Timeline,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { FaBriefcase, FaUsers } from "react-icons/fa6";

export const WorkExperienceTimeline = () => {
  const t = useTranslations("user.me");
  const workExperiences = [
    {
      company: t("workExperiences.systemIntegration.company"),
      description: t("workExperiences.systemIntegration.description"),
      type: "fulltime",
    },
    {
      company: t("workExperiences.eCommerce.company"),
      description: t("workExperiences.eCommerce.description"),
      type: "fulltime",
    },
    {
      company: t("workExperiences.fintech.company"),
      description: t("workExperiences.fintech.description"),
      type: "fulltime",
    },
    {
      company: t("workExperiences.restaurant.company"),
      description: t("workExperiences.restaurant.description"),
      type: "contract",
    },
    {
      company: t("workExperiences.foodDelivery.company"),
      description: t("workExperiences.foodDelivery.description"),
      type: "fulltime",
    },
    {
      company: t("workExperiences.media.company"),
      description: t("workExperiences.media.description"),
      type: "contract",
    },
  ] as const;
  const workTypeMap = {
    contract: {
      colorPalette: "green",
      icon: FaUsers,
      label: t("workLegendContract"),
    },
    fulltime: {
      colorPalette: "blue",
      icon: FaBriefcase,
      label: t("workLegendFulltime"),
    },
  } as const;

  return (
    <Stack gap={0} maxW="34rem" mx="auto" w="full">
      <Heading as="h2" mb={0}>
        {t("workHeading")}
      </Heading>
      <HStack flexWrap="wrap" gap={2}>
        <HStack gap={1}>
          <Box
            alignItems="center"
            display="flex"
            h="var(--notebook-line-height)"
            justifyContent="center"
            w="var(--notebook-line-height)"
          >
            <Box
              alignItems="center"
              bg="blue.solid"
              borderRadius="full"
              display="flex"
              h="6"
              justifyContent="center"
              w="6"
            >
              <Icon as={FaBriefcase} color="blue.contrast" fontSize="xs" />
            </Box>
          </Box>
          <Text>{t("workLegendFulltime")}</Text>
        </HStack>
        <HStack gap={1}>
          <Box
            alignItems="center"
            display="flex"
            h="var(--notebook-line-height)"
            justifyContent="center"
            w="var(--notebook-line-height)"
          >
            <Box
              alignItems="center"
              bg="green.solid"
              borderRadius="full"
              display="flex"
              h="6"
              justifyContent="center"
              w="6"
            >
              <Icon as={FaUsers} color="green.contrast" fontSize="xs" />
            </Box>
          </Box>
          <Text>{t("workLegendContract")}</Text>
        </HStack>
      </HStack>
      <Timeline.Root variant="subtle">
        {workExperiences.map((experience) => {
          const typeMeta = workTypeMap[experience.type];
          return (
            <Timeline.Item key={experience.company}>
              <Timeline.Connector>
                <Timeline.Separator
                  bg="border.muted"
                  insetInline="calc(var(--notebook-line-height) / 2)"
                  transform="translateY(4px)"
                />
                <Timeline.Indicator
                  bg="transparent"
                  color={`${typeMeta.colorPalette}.contrast`}
                  h="var(--notebook-line-height)"
                  outline="none"
                  w="var(--notebook-line-height)"
                >
                  <Box
                    alignItems="center"
                    bg={`${typeMeta.colorPalette}.solid`}
                    borderRadius="full"
                    display="flex"
                    h={6}
                    justifyContent="center"
                    w={6}
                  >
                    <Icon as={typeMeta.icon} fontSize="xs" />
                  </Box>
                </Timeline.Indicator>
              </Timeline.Connector>
              <Timeline.Content gap={0} pb={`var(--notebook-line-height)`}>
                <Timeline.Title lineHeight="var(--notebook-line-height)">
                  <HStack gap={3}>
                    <Text as="span" fontWeight="bold">
                      {experience.company}
                    </Text>
                    <Badge colorPalette={typeMeta.colorPalette} size="sm">
                      {typeMeta.label}
                    </Badge>
                  </HStack>
                </Timeline.Title>
                <Timeline.Description lineHeight="var(--notebook-line-height)">
                  {experience.description}
                </Timeline.Description>
              </Timeline.Content>
            </Timeline.Item>
          );
        })}
      </Timeline.Root>
    </Stack>
  );
};

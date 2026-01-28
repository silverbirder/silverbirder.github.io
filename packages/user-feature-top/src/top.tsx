"use client";

import {
  Box,
  Heading,
  HStack,
  Icon,
  Text,
  Timeline,
  VStack,
} from "@chakra-ui/react";
import { Link, MdxClientWrapper, Notebook, ViewTransitionLink } from "@repo/ui";
import { NOTEBOOK_LINE_HEIGHT } from "@repo/ui";
import { useTranslations } from "next-intl";
import { FaBookmark, FaCommentDots, FaShareNodes } from "react-icons/fa6";

import type { TimelineItem } from "./timeline";

type BlogSummary = {
  latestPublishedAt: string;
  totalCount: number;
};

type Props = {
  blogSummary: BlogSummary;
  timelineItems?: TimelineItem[];
};

export const Top = ({ blogSummary, timelineItems = [] }: Props) => {
  const t = useTranslations("user.top");
  const blogStatsLabel = t("toc.reader.items.blogStats", {
    latestDate: blogSummary.latestPublishedAt,
    totalCount: blogSummary.totalCount,
  });
  const timelineIconMap = {
    bookmark: FaBookmark,
    share: FaShareNodes,
    tweet: FaCommentDots,
  } as const;

  return (
    <Box w="full">
      <Notebook navigation={{}} relatedPosts={[]} tags={[]} title={t("title")}>
        <VStack alignItems="flex-start" gap={0}>
          <Text mb={0}>{t("welcome")}</Text>
          <Box>
            <Heading as="h2">{t("toc.firstTime.title")}</Heading>
            <VStack alignItems="flex-start" gap={0}>
              <ViewTransitionLink
                href="/me"
                lineHeight="var(--notebook-line-height)"
              >
                {t("toc.firstTime.items.me")}
              </ViewTransitionLink>
            </VStack>
          </Box>
          <Box>
            <Heading as="h2">{t("toc.reader.title")}</Heading>
            <VStack alignItems="flex-start" gap={0}>
              <HStack alignItems="baseline" gap={0}>
                <ViewTransitionLink
                  href="/blog"
                  lineHeight="var(--notebook-line-height)"
                >
                  {t("toc.reader.items.blog")}
                </ViewTransitionLink>
                <Text
                  lineHeight="var(--notebook-line-height)"
                  my={0}
                  textStyle="2xs"
                >
                  {blogStatsLabel}
                </Text>
              </HStack>
            </VStack>
          </Box>
          <Box mt={NOTEBOOK_LINE_HEIGHT}>
            <Heading as="h2" mt={0}>
              {t("timeline.heading")}
            </Heading>
            <Timeline.Root variant="subtle">
              {timelineItems.map((item) => (
                <Timeline.Item gap={0} key={item.key}>
                  <Timeline.Connector>
                    <Timeline.Separator
                      borderColor="green.solid"
                      insetInline="calc(var(--notebook-line-height) / 2)"
                      transform="translateY(4px)"
                    />
                    <Timeline.Indicator
                      bg="transparent"
                      color="green.contrast"
                      h="var(--notebook-line-height)"
                      outline="none"
                      w="var(--notebook-line-height)"
                    >
                      <Box
                        alignItems="center"
                        bg="green.solid"
                        borderRadius="full"
                        display="flex"
                        h={6}
                        justifyContent="center"
                        w={6}
                      >
                        <Icon as={timelineIconMap[item.type]} fontSize="xs" />
                      </Box>
                    </Timeline.Indicator>
                  </Timeline.Connector>
                  <Timeline.Content gap={0} pb="var(--notebook-line-height)">
                    <Timeline.Title lineHeight="var(--notebook-line-height)">
                      {item.date}
                    </Timeline.Title>
                    <Timeline.Description lineHeight="var(--notebook-line-height)">
                      {item.compiledSource ? (
                        <Box css={{ "& *": { marginBlock: 0 } }} w="full">
                          <MdxClientWrapper
                            compiledSource={item.compiledSource}
                          />
                        </Box>
                      ) : null}
                    </Timeline.Description>
                  </Timeline.Content>
                </Timeline.Item>
              ))}
            </Timeline.Root>
          </Box>
          <Box mb={NOTEBOOK_LINE_HEIGHT}>
            <Heading as="h2" mt={0}>
              {t("toc.other.title")}
            </Heading>
            <VStack alignItems="flex-start" gap={0}>
              <Link
                href="https://fequest.vercel.app/9"
                lineHeight="var(--notebook-line-height)"
              >
                {t("toc.other.items.featureRequest")}
              </Link>
            </VStack>
          </Box>
        </VStack>
      </Notebook>
    </Box>
  );
};

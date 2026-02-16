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
import {
  Link,
  MdxClientWrapper,
  Notebook,
  PaperStack,
  ViewTransitionLink,
} from "@repo/ui";
import { NOTEBOOK_LINE_HEIGHT } from "@repo/ui";
import { useTranslations } from "next-intl";
import { FaBookmark, FaCommentDots, FaShareNodes } from "react-icons/fa6";

import type { TimelineItem } from "./timeline";

type BlogSummary = {
  latestPublishedAt: string;
  streakDays: number;
  totalCount: number;
};

type Props = {
  blogSummary: BlogSummary;
  timelineItems?: TimelineItem[];
};

export const Top = ({ blogSummary, timelineItems = [] }: Props) => {
  const t = useTranslations("user.top");
  const maxPaperStackCount = 10;
  const fullStackCount = Math.floor(blogSummary.totalCount / 10);
  const remainderCount = blogSummary.totalCount % maxPaperStackCount;
  const paperStackCounts = [
    ...Array.from({ length: fullStackCount }, () => maxPaperStackCount),
    ...(remainderCount > 0 ? [remainderCount] : []),
  ];
  const blogStatsLines = [
    t("toc.reader.items.blogStats.total", {
      totalCount: blogSummary.totalCount,
    }),
    t("toc.reader.items.blogStats.streak", {
      streakDays: blogSummary.streakDays,
    }),
    t("toc.reader.items.blogStats.latest", {
      latestDate: blogSummary.latestPublishedAt,
    }),
  ];
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
              <ViewTransitionLink
                href="/blog"
                lineHeight="var(--notebook-line-height)"
              >
                {t("toc.reader.items.blog")}
              </ViewTransitionLink>
              <VStack alignItems="flex-start" gap={0}>
                <HStack alignItems="flex-start" flexWrap="wrap" gap={0}>
                  {paperStackCounts.map((paperStackCount, index) => (
                    <Box
                      data-paper-stack-count={paperStackCount}
                      h="calc(var(--notebook-line-height) * 3)"
                      key={`paper-stack-${paperStackCount}-${index}`}
                      overflow="visible"
                      w={`calc(var(--notebook-line-height) * 1.4)`}
                    >
                      <Box
                        h="calc(var(--notebook-line-height) * 3)"
                        w="calc(var(--notebook-line-height) * 3)"
                      >
                        <PaperStack
                          count={paperStackCount}
                          maxCount={maxPaperStackCount}
                        />
                      </Box>
                    </Box>
                  ))}
                </HStack>
                <HStack alignItems="flex-start" gap={0} wrap="wrap">
                  {blogStatsLines.map((line, index) => (
                    <Text
                      fontSize="2xs"
                      key={line}
                      lineHeight="var(--notebook-line-height)"
                      ml={index === 0 ? 0 : 2}
                      my={0}
                    >
                      {line}
                    </Text>
                  ))}
                </HStack>
              </VStack>
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

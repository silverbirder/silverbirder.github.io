"use client";

import type { Route } from "next";

import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import { Notebook, NotebookPostItem, Tag, ViewTransitionLink } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  PostSearchPanel,
  type SearchResult,
  type SearchStatus,
} from "./post-search-panel";
import {
  filterPosts,
  getAvailableTags,
  getAvailableYears,
  getPaginationItems,
  normalizePosts,
  paginatePosts,
  type PostSummary,
} from "./posts.presenter";

const ELLIPSIS = "…";

type Props = {
  posts: PostSummary[];
};

export const Posts = ({ posts }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQueryParam = searchParams.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("loading");
  const searchUrlSyncTimerRef = useRef<null | number>(null);

  const selectedYear = searchParams.get("year") ?? null;
  const selectedTag = searchParams.get("tag") ?? null;
  const pageParam = searchParams.get("page");
  const parsedPage = pageParam ? Number(pageParam) : 1;
  const urlCurrentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentPage = urlCurrentPage;

  const t = useTranslations("user.blog");
  const metaSeparator = t("metaSeparator");
  const normalizedPosts = normalizePosts(posts);
  const postsBySlug = useMemo(() => {
    return new Map(normalizedPosts.map((post) => [post.slug, post]));
  }, [normalizedPosts]);
  const availableYears = getAvailableYears(normalizedPosts);
  const availableTags = getAvailableTags(normalizedPosts);
  const filteredPosts = filterPosts(normalizedPosts, {
    tag: selectedTag,
    year: selectedYear,
  });
  const filteredSlugSet = useMemo(() => {
    return new Set(filteredPosts.map((post) => post.slug));
  }, [filteredPosts]);
  const pagination = paginatePosts(filteredPosts, currentPage);
  const paginationItems = getPaginationItems(
    pagination.currentPage,
    pagination.totalPages,
  );

  useEffect(() => {
    if (searchQueryParam !== searchQuery) {
      setSearchQuery(searchQueryParam);
    }
  }, [searchQuery, searchQueryParam]);

  useEffect(() => {
    return () => {
      if (searchUrlSyncTimerRef.current) {
        window.clearTimeout(searchUrlSyncTimerRef.current);
      }
    };
  }, []);

  const buildHref = useCallback(
    (input: {
      page?: null | number;
      query?: null | string;
      tag?: null | string;
      year?: null | string;
    }) => {
      const params = new URLSearchParams();
      const resolvedYear = input.year === undefined ? selectedYear : input.year;
      const resolvedTag = input.tag === undefined ? selectedTag : input.tag;
      const resolvedPage =
        input.page === undefined ? currentPage : (input.page ?? undefined);
      const resolvedQuery =
        input.query === undefined
          ? searchQueryParam
          : (input.query ?? undefined);

      if (resolvedYear) {
        params.set("year", resolvedYear);
      }

      if (resolvedTag) {
        params.set("tag", resolvedTag);
      }

      if (resolvedPage && resolvedPage > 1) {
        params.set("page", String(resolvedPage));
      }

      if (resolvedQuery) {
        params.set("q", resolvedQuery);
      }

      const query = params.toString();
      return query ? `/blog?${query}` : "/blog";
    },
    [currentPage, searchQueryParam, selectedTag, selectedYear],
  );

  const syncSearchQueryToUrl = useCallback(
    (nextQuery: string) => {
      if (searchUrlSyncTimerRef.current) {
        window.clearTimeout(searchUrlSyncTimerRef.current);
      }
      if (nextQuery === searchQueryParam) {
        return;
      }
      searchUrlSyncTimerRef.current = window.setTimeout(() => {
        router.replace(
          buildHref({
            page: null,
            query: nextQuery || null,
          }) as Route,
          {
            scroll: false,
          },
        );
      }, 250);
    },
    [buildHref, router, searchQueryParam],
  );

  const handleSearchResults = useCallback(
    (results: SearchResult[], query: string, status: SearchStatus) => {
      setSearchResults(results);
      setSearchQuery(query);
      setSearchStatus(status);
      syncSearchQueryToUrl(query);
    },
    [syncSearchQueryToUrl],
  );

  return (
    <Box w="full">
      <Notebook
        headerRight={
          <PostSearchPanel
            initialQuery={searchQueryParam}
            onResultsChange={handleSearchResults}
          />
        }
        navigation={{}}
        relatedPosts={[]}
        tags={[]}
        title={t("title")}
      >
        <Stack
          className="not-prose"
          gap="var(--notebook-line-height)"
          py="var(--notebook-line-height)"
        >
          {(selectedYear || selectedTag) && (
            <Stack direction="row" gap={0} wrap="wrap">
              {selectedYear && (
                <Tag
                  href={buildHref({ page: null, year: null })}
                  iconType="year"
                  isSelected
                  mr={2}
                  tag={selectedYear}
                />
              )}
              {selectedTag && (
                <Tag
                  href={buildHref({ page: null, tag: null })}
                  isSelected
                  mr={2}
                  tag={selectedTag}
                />
              )}
            </Stack>
          )}
          {searchQuery.length > 0 ? (
            searchStatus === "ready" && searchResults.length === 0 ? (
              <Text>{t("searchEmpty")}</Text>
            ) : (
              searchResults
                .filter((post) => filteredSlugSet.has(post.slug))
                .map((post) => {
                  const matchedPost = postsBySlug.get(post.slug);
                  const postSummary =
                    matchedPost ??
                    ({
                      publishedAt: post.publishedAt,
                      slug: post.slug,
                      summary: "",
                      tags: [],
                      title: post.title,
                    } satisfies PostSummary);

                  return (
                    <NotebookPostItem
                      buildTagHref={(tag) =>
                        buildHref({
                          page: null,
                          tag: selectedTag === tag ? null : tag,
                        })
                      }
                      key={post.slug}
                      metaSeparator={metaSeparator}
                      post={postSummary}
                      selectedTag={selectedTag}
                    />
                  );
                })
            )
          ) : pagination.items.length === 0 ? (
            <Text>{t("empty")}</Text>
          ) : (
            pagination.items.map((post) => (
              <NotebookPostItem
                buildTagHref={(tag) =>
                  buildHref({
                    page: null,
                    tag: selectedTag === tag ? null : tag,
                  })
                }
                key={post.slug}
                metaSeparator={metaSeparator}
                post={post}
                selectedTag={selectedTag}
              />
            ))
          )}
        </Stack>
        {searchQuery.length === 0 && pagination.totalPages > 1 && (
          <Box
            aria-label={t("paginationLabel")}
            className="not-prose"
            pb={"var(--notebook-line-height)"}
          >
            <Stack direction="row" gap={2} wrap="wrap">
              <ViewTransitionLink
                aria-disabled={pagination.currentPage <= 1}
                href={buildHref({ page: pagination.currentPage - 1 })}
                lineHeight="var(--notebook-line-height)"
                pointerEvents={pagination.currentPage <= 1 ? "none" : "auto"}
              >
                {t("paginationPrev")}
              </ViewTransitionLink>
              {paginationItems.map((item) => {
                if (item.type === "ellipsis") {
                  return (
                    <Text
                      key={item.key}
                      lineHeight="var(--notebook-line-height)"
                      px={2}
                    >
                      {ELLIPSIS}
                    </Text>
                  );
                }
                return (
                  <ViewTransitionLink
                    fontWeight={item.isCurrent ? "bold" : "normal"}
                    href={buildHref({ page: item.page })}
                    key={item.page}
                    lineHeight="var(--notebook-line-height)"
                    textDecoration={item.isCurrent ? "underline" : "none"}
                  >
                    {item.page}
                  </ViewTransitionLink>
                );
              })}
              <ViewTransitionLink
                aria-disabled={pagination.currentPage >= pagination.totalPages}
                href={buildHref({ page: pagination.currentPage + 1 })}
                lineHeight="var(--notebook-line-height)"
                pointerEvents={
                  pagination.currentPage >= pagination.totalPages
                    ? "none"
                    : "auto"
                }
              >
                {t("paginationNext")}
              </ViewTransitionLink>
            </Stack>
          </Box>
        )}
        {searchQuery.length === 0 &&
          (availableYears.length > 0 || availableTags.length > 0) && (
            <Box pb={"var(--notebook-line-height)"}>
              <Heading as="h2">{t("filtersTitle")}</Heading>
              {availableYears.length > 0 && (
                <Box>
                  <Stack direction="row" gap={0} wrap="wrap">
                    {availableYears.map((year) => (
                      <Tag
                        href={buildHref({
                          page: null,
                          year: selectedYear === year ? null : year,
                        })}
                        iconType="year"
                        isSelected={selectedYear === year}
                        key={year}
                        mr={2}
                        tag={year}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              {availableTags.length > 0 && (
                <Box>
                  <Stack direction="row" gap={0} wrap="wrap">
                    {availableTags.map((tag) => (
                      <Tag
                        href={buildHref({
                          page: null,
                          tag: selectedTag === tag ? null : tag,
                        })}
                        isSelected={selectedTag === tag}
                        key={tag}
                        mr={2}
                        tag={tag}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          )}
      </Notebook>
    </Box>
  );
};

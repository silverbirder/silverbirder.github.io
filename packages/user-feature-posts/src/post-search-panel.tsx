"use client";

import { Flex, IconButton, Input } from "@chakra-ui/react";
import { buildSitePath } from "@repo/util";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";

export type SearchResult = {
  publishedAt: string;
  slug: string;
  title: string;
};

export type SearchStatus = "error" | "loading" | "ready";

type Props = {
  initialQuery?: string;
  onResultsChange: (
    results: SearchResult[],
    query: string,
    status: SearchStatus,
  ) => void;
};

const SEARCH_RESULT_LIMIT = 20;
const SEARCH_INDEX_CACHE_KEY = "blog-search-index";
const SEARCH_INDEX_VERSION_KEY = "blog-search-index-version";

export const PostSearchPanel = ({
  initialQuery = "",
  onResultsChange,
}: Props) => {
  const t = useTranslations("user.blog");
  const searchInputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<null | Worker>(null);
  const onResultsChangeRef = useRef(onResultsChange);
  const queryRef = useRef("");
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("loading");
  const searchIndexPath = useMemo(
    () => buildSitePath("blog-search-index.json"),
    [],
  );
  const searchIndexVersionPath = useMemo(
    () => buildSitePath("blog-search-index.version.json"),
    [],
  );
  const trimmedSearchQuery = searchQuery.trim();

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    onResultsChangeRef.current = onResultsChange;
  }, [onResultsChange]);

  useEffect(() => {
    queryRef.current = trimmedSearchQuery;
  }, [trimmedSearchQuery]);

  useEffect(() => {
    onResultsChangeRef.current(searchResults, trimmedSearchQuery, searchStatus);
  }, [searchResults, searchStatus, trimmedSearchQuery]);

  useEffect(() => {
    const worker = new Worker(new URL("./search.worker.ts", import.meta.url));
    workerRef.current = worker;
    setSearchStatus("loading");

    const handleMessage = (
      event: MessageEvent<
        | { payload: { count: number }; type: "ready" }
        | { payload: { message: string }; type: "error" }
        | {
            payload: { query: string; results: SearchResult[] };
            type: "results";
          }
      >,
    ) => {
      const message = event.data;
      if (message.type === "ready") {
        setSearchStatus("ready");
        if (queryRef.current) {
          worker.postMessage({
            payload: { limit: SEARCH_RESULT_LIMIT, query: queryRef.current },
            type: "search",
          });
        }
        return;
      }
      if (message.type === "error") {
        setSearchStatus("error");
        return;
      }
      if (message.type === "results") {
        if (message.payload.query !== queryRef.current) {
          return;
        }
        setSearchResults(message.payload.results);
      }
    };

    worker.addEventListener("message", handleMessage);

    const loadIndex = async () => {
      const cache = (() => {
        try {
          return {
            json: localStorage.getItem(SEARCH_INDEX_CACHE_KEY),
            version: localStorage.getItem(SEARCH_INDEX_VERSION_KEY),
          };
        } catch {
          return { json: null, version: null };
        }
      })();

      const versionResponse = await fetch(searchIndexVersionPath).catch(
        () => null,
      );
      const versionJson = versionResponse?.ok
        ? await versionResponse.json().catch(() => null)
        : null;
      const latestVersion =
        versionJson && typeof versionJson.version === "string"
          ? versionJson.version
          : null;

      if (latestVersion && cache.version === latestVersion && cache.json) {
        worker.postMessage({ payload: { json: cache.json }, type: "load" });
        return;
      }

      const indexResponse = await fetch(searchIndexPath);
      if (!indexResponse.ok) {
        throw new Error("Failed to fetch search index");
      }
      const json = await indexResponse.text();

      try {
        localStorage.setItem(SEARCH_INDEX_CACHE_KEY, json);
        if (latestVersion) {
          localStorage.setItem(SEARCH_INDEX_VERSION_KEY, latestVersion);
        } else {
          localStorage.removeItem(SEARCH_INDEX_VERSION_KEY);
        }
      } catch {
        // localStorage may be unavailable; skip cache
      }

      worker.postMessage({ payload: { json }, type: "load" });
    };

    loadIndex().catch(() => {
      setSearchStatus("error");
    });

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
      workerRef.current = null;
    };
  }, [searchIndexPath, searchIndexVersionPath]);

  useEffect(() => {
    if (!workerRef.current) {
      return undefined;
    }

    if (!trimmedSearchQuery) {
      setSearchResults([]);
      return undefined;
    }

    if (searchStatus !== "ready") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      workerRef.current?.postMessage({
        payload: { limit: SEARCH_RESULT_LIMIT, query: trimmedSearchQuery },
        type: "search",
      });
    }, 150);

    return () => window.clearTimeout(timer);
  }, [searchStatus, trimmedSearchQuery]);

  return (
    <Flex align="center" gap={1.5}>
      <IconButton
        aria-label={t("searchLabel")}
        onClick={() => inputRef.current?.focus()}
        size="xs"
        variant="ghost"
      >
        <LuSearch />
      </IconButton>
      <Input
        aria-label={t("searchLabel")}
        id={searchInputId}
        onChange={(event) => setSearchQuery(event.target.value)}
        ref={inputRef}
        size="xs"
        value={searchQuery}
        variant="flushed"
        w="140px"
      />
    </Flex>
  );
};

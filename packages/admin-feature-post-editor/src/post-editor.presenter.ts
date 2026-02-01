"use client";

import type { SerializeResult } from "next-mdx-remote-client";

import { formatDate, hasFrontmatter } from "@repo/util";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildSummaryFromBody, generateZennSlug } from "./libs";
import { useDebouncedCallback } from "./post-editor.debounce";
import { useImageDropzone } from "./post-editor.image-dropzone";
import { usePostEditorTags } from "./post-editor.tags";

type Props = {
  createPullRequestDisabled?: boolean;
  enableHatenaSync?: boolean;
  enableZennSync?: boolean;
  initialBody?: string;
  initialHatenaEnabled?: boolean;
  initialPublishedAt?: string;
  initialSummary?: string;
  initialTags?: string[];
  initialTitle?: string;
  initialZennEnabled?: boolean;
  initialZennType?: string;
  onCreatePullRequest?: (draft: {
    body: string;
    hatena?: {
      enabled: boolean;
    };
    index: boolean;
    publishedAt: string;
    summary: string;
    tags: string[];
    title: string;
    zenn?: {
      enabled: boolean;
      slug: string;
      topics: string[];
      type: string;
    };
  }) => Promise<void | {
    actions?: Array<
      { message: string; type: "alert" } | { type: "open"; url: string }
    >;
  }>;
  resolveLinkTitles: (source: string) => Promise<string>;
  resolvePreview: (source: string) => Promise<SerializeResult>;
  tagSuggestions?: string[];
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
};

export const usePostEditorPresenter = ({
  createPullRequestDisabled,
  enableHatenaSync = false,
  enableZennSync = false,
  initialBody,
  initialHatenaEnabled,
  initialPublishedAt,
  initialSummary,
  initialTags,
  initialTitle,
  initialZennEnabled,
  initialZennType,
  onCreatePullRequest,
  resolveLinkTitles,
  resolvePreview,
  tagSuggestions,
  uploadImage,
}: Props) => {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [body, setBody] = useState(initialBody ?? "");
  const [previewSource, setPreviewSource] = useState<null | SerializeResult>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isResolvingLinks, setIsResolvingLinks] = useState(false);
  const [isCreatingPullRequest, setIsCreatingPullRequest] = useState(false);
  const [publishedAt, setPublishedAt] = useState(() =>
    initialPublishedAt ? initialPublishedAt : formatDate(new Date()),
  );
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [hatenaEnabled, setHatenaEnabled] = useState(
    initialHatenaEnabled ?? false,
  );
  const [zennEnabled, setZennEnabled] = useState(initialZennEnabled ?? false);
  const [zennSlug, setZennSlug] = useState("");
  const [zennType, setZennType] = useState(initialZennType ?? "tech");

  const bodyRef = useRef(body);
  const initialAppliedRef = useRef(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isBodyEmpty = body.length === 0;
  const shouldNoindex =
    (enableHatenaSync && hatenaEnabled) || (enableZennSync && zennEnabled);

  const hasFrontmatterValue = useMemo(() => hasFrontmatter(body), [body]);

  const {
    normalizedTagSuggestions,
    onTagInputBlur,
    onTagInputChange,
    onTagInputKeyDown,
    onTagRemove,
    onTagSuggestionClick,
    setTags,
    tagInputValue,
    tags,
  } = usePostEditorTags({ initialTags, tagSuggestions });

  const { schedule: schedulePreview } = useDebouncedCallback(
    async (value: string) => {
      try {
        const data = await resolvePreview(value);
        setPreviewSource(data ?? null);
      } catch {
        setPreviewSource(null);
      } finally {
        setIsPreviewLoading(false);
      }
    },
    350,
  );

  const onBodyChange = useCallback(
    (value: string) => {
      setBody(value);
      setIsPreviewLoading(true);
      schedulePreview(value);
    },
    [schedulePreview],
  );

  const updateSummaryFromBody = useCallback((value: string) => {
    const nextSummary = buildSummaryFromBody(value);
    setSummary(nextSummary);
  }, []);

  const handleBodyChange = useCallback(
    (value: string) => {
      bodyRef.current = value;
      onBodyChange(value);
      updateSummaryFromBody(value);
    },
    [onBodyChange, updateSummaryFromBody],
  );

  const { getInputProps, getRootProps, isDragActive, isUploading } =
    useImageDropzone({
      bodyRef,
      bodyTextareaRef,
      onBodyChange: handleBodyChange,
      uploadImage,
    });

  const createPullRequestIsDisabled =
    createPullRequestDisabled === true ||
    isBodyEmpty ||
    (title.length === 0 && !hasFrontmatterValue) ||
    isUploading ||
    isResolvingLinks ||
    isCreatingPullRequest ||
    !onCreatePullRequest ||
    (enableHatenaSync && hatenaEnabled && title.length === 0) ||
    (enableZennSync &&
      zennEnabled &&
      (zennSlug.length === 0 || zennType.length === 0 || title.length === 0));

  const isLoading = isUploading || isResolvingLinks || isCreatingPullRequest;

  const handleCreatePullRequest = useCallback(async () => {
    if (!onCreatePullRequest || createPullRequestIsDisabled) {
      return;
    }

    setIsCreatingPullRequest(true);

    try {
      const result = await onCreatePullRequest({
        body: bodyRef.current,
        hatena: {
          enabled: enableHatenaSync && hatenaEnabled,
        },
        index: !shouldNoindex,
        publishedAt,
        summary,
        tags,
        title,
        zenn: {
          enabled: enableZennSync && zennEnabled,
          slug: zennSlug,
          topics: [],
          type: zennType,
        },
      });
      if (
        result &&
        typeof result === "object" &&
        "actions" in result &&
        Array.isArray(result.actions)
      ) {
        for (const action of result.actions) {
          if (action?.type === "open") {
            window.open(action.url, "_blank", "noopener,noreferrer");
          }
          if (action?.type === "alert") {
            window.alert(action.message);
          }
        }
      }
    } finally {
      setIsCreatingPullRequest(false);
    }
  }, [
    createPullRequestIsDisabled,
    onCreatePullRequest,
    publishedAt,
    summary,
    tags,
    title,
    enableHatenaSync,
    hatenaEnabled,
    enableZennSync,
    shouldNoindex,
    zennEnabled,
    zennSlug,
    zennType,
  ]);

  const handleResolveLinkTitles = useCallback(async () => {
    if (isResolvingLinks || isBodyEmpty) {
      return;
    }

    const currentBody = bodyRef.current;
    if (currentBody.length === 0) {
      return;
    }

    const textarea = bodyTextareaRef.current;
    const selectionStart = textarea?.selectionStart ?? null;
    const selectionEnd = textarea?.selectionEnd ?? null;

    setIsResolvingLinks(true);

    try {
      const resolved = await resolveLinkTitles(currentBody);
      if (typeof resolved === "string" && resolved !== currentBody) {
        handleBodyChange(resolved);
      }
    } catch {
      // ignore resolve errors to avoid breaking the editor flow
    } finally {
      setIsResolvingLinks(false);
      requestAnimationFrame(() => {
        if (!textarea) {
          return;
        }
        textarea.focus();
        if (selectionStart !== null && selectionEnd !== null) {
          textarea.setSelectionRange(selectionStart, selectionEnd);
        }
      });
    }
  }, [handleBodyChange, isBodyEmpty, isResolvingLinks, resolveLinkTitles]);

  useEffect(() => {
    bodyRef.current = body;
  }, [body, summary]);

  useEffect(() => {
    if (initialAppliedRef.current) {
      return;
    }

    const hasInitialValues =
      initialBody !== undefined ||
      initialTitle !== undefined ||
      initialPublishedAt !== undefined ||
      initialSummary !== undefined ||
      (initialTags && initialTags.length > 0) ||
      initialHatenaEnabled !== undefined ||
      initialZennEnabled !== undefined ||
      initialZennType !== undefined;

    if (!hasInitialValues) {
      return;
    }

    if (initialTitle !== undefined) {
      setTitle(initialTitle);
    }

    if (initialSummary !== undefined) {
      setSummary(initialSummary);
    }

    if (initialTags) {
      setTags(initialTags);
    }

    if (initialHatenaEnabled !== undefined) {
      setHatenaEnabled(initialHatenaEnabled);
    }

    if (initialZennEnabled !== undefined) {
      setZennEnabled(initialZennEnabled);
    }

    if (initialZennType !== undefined) {
      setZennType(initialZennType);
    }

    if (initialPublishedAt) {
      setPublishedAt(initialPublishedAt);
    }

    if (initialBody !== undefined) {
      onBodyChange(initialBody);
    }

    initialAppliedRef.current = true;
  }, [
    initialBody,
    initialPublishedAt,
    initialSummary,
    initialTags,
    initialTitle,
    initialHatenaEnabled,
    initialZennEnabled,
    initialZennType,
    onBodyChange,
    setTitle,
    setTags,
  ]);

  useEffect(() => {
    if (!enableZennSync || !zennEnabled) {
      return;
    }
    if (zennSlug.length > 0) {
      return;
    }
    setZennSlug(generateZennSlug());
  }, [enableZennSync, zennEnabled, zennSlug]);

  return {
    body,
    bodyTextareaRef,
    createPullRequestIsDisabled,
    getInputProps,
    getRootProps,
    hatenaEnabled,
    isCreatingPullRequest,
    isDragActive,
    isLoading,
    isPreviewLoading,
    onBodyChange: handleBodyChange,
    onCreatePullRequest: onCreatePullRequest
      ? handleCreatePullRequest
      : undefined,
    onHatenaEnabledChange: enableHatenaSync ? setHatenaEnabled : undefined,
    onPublishedAtChange: setPublishedAt,
    onResolveLinkTitles: handleResolveLinkTitles,
    onTagInputBlur,
    onTagInputChange,
    onTagInputKeyDown,
    onTagRemove,
    onTagSuggestionClick,
    onTitleChange: setTitle,
    onZennEnabledChange: enableZennSync ? setZennEnabled : undefined,
    onZennTypeChange: enableZennSync ? setZennType : undefined,
    previewSource,
    publishedAt,
    resolveLinkTitlesDisabled: isBodyEmpty || isUploading || isResolvingLinks,
    resolveLinkTitlesIsLoading: isResolvingLinks,
    summary,
    tagInputValue,
    tags,
    tagSuggestions: normalizedTagSuggestions,
    title,
    zennEnabled,
    zennType,
  };
};

export type { Props };

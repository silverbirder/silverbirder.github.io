"use client";

import type { SerializeResult } from "next-mdx-remote-client";
import type { KeyboardEvent } from "react";

import { formatDate, hasFrontmatter } from "@repo/util";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { buildSummaryFromBody, generateZennSlug } from "./libs";

type Props = {
  createPullRequestDisabled?: boolean;
  enableHatenaSync?: boolean;
  enableZennSync?: boolean;
  initialBody?: string;
  initialHatenaEnabled?: boolean;
  initialIndex?: boolean;
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
  initialIndex,
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
  const [isUploading, setIsUploading] = useState(false);
  const [isResolvingLinks, setIsResolvingLinks] = useState(false);
  const [isCreatingPullRequest, setIsCreatingPullRequest] = useState(false);
  const [publishedAt, setPublishedAt] = useState(() =>
    initialPublishedAt ? initialPublishedAt : formatDate(new Date()),
  );
  const [indexEnabled, setIndexEnabled] = useState(() => initialIndex ?? false);
  const [summary, setSummary] = useState(initialSummary ?? "");
  const [summaryMode, setSummaryMode] = useState<"auto" | "manual">(() =>
    initialSummary && initialSummary.trim().length > 0 ? "manual" : "auto",
  );
  const [tags, setTags] = useState<string[]>(initialTags ?? []);
  const [tagInputValue, setTagInputValue] = useState("");
  const [hatenaEnabled, setHatenaEnabled] = useState(
    initialHatenaEnabled ?? false,
  );
  const [zennEnabled, setZennEnabled] = useState(initialZennEnabled ?? false);
  const [zennSlug, setZennSlug] = useState("");
  const [zennType, setZennType] = useState(initialZennType ?? "tech");

  const debounceRef = useRef<null | number>(null);
  const bodyRef = useRef(body);
  const summaryRef = useRef(summary);
  const summaryModeRef = useRef(summaryMode);
  const initialAppliedRef = useRef(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isBodyEmpty = body.length === 0;

  const hasFrontmatterValue = useMemo(() => hasFrontmatter(body), [body]);

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

  const normalizedTagSuggestions = useMemo(() => {
    const selected = new Set(tags.map((tag) => tag.toLowerCase()));
    const suggestions = tagSuggestions ?? [];
    return suggestions.filter((tag) => !selected.has(tag.toLowerCase()));
  }, [tagSuggestions, tags]);

  const isLoading = isUploading || isResolvingLinks || isCreatingPullRequest;

  const onBodyChange = useCallback(
    (value: string) => {
      setBody(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      setIsPreviewLoading(true);

      debounceRef.current = window.setTimeout(async () => {
        try {
          const data = await resolvePreview(value);
          setPreviewSource(data ?? null);
        } catch {
          setPreviewSource(null);
        } finally {
          setIsPreviewLoading(false);
        }
      }, 350);
    },
    [resolvePreview],
  );

  const updateSummaryIfAuto = useCallback((value: string) => {
    const currentSummary = summaryRef.current;
    const currentMode = summaryModeRef.current;
    if (currentMode === "auto" || currentSummary.trim() === "") {
      const nextSummary = buildSummaryFromBody(value);
      setSummary(nextSummary);
      setSummaryMode("auto");
    }
  }, []);

  const handleBodyChange = useCallback(
    (value: string) => {
      bodyRef.current = value;
      onBodyChange(value);
      updateSummaryIfAuto(value);
    },
    [onBodyChange, updateSummaryIfAuto],
  );

  const uploadImageToCloudinary = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await uploadImage(formData);

      if (!payload.url) {
        throw new Error("Upload response is missing url.");
      }

      return payload.url;
    },
    [uploadImage],
  );

  const normalizeAltText = useCallback((fileName: string) => {
    const trimmed = fileName.replace(/\.[^.]+$/, "");
    const replaced = trimmed.replace(/[-_]+/g, " ");
    return replaced.length > 0 ? replaced : "image";
  }, []);

  const buildMarkdownImage = useCallback(
    (file: File, url: string) => {
      const alt = normalizeAltText(file.name);
      return `![${alt}](${url})`;
    },
    [normalizeAltText],
  );

  const insertAtCursor = useCallback(
    (snippet: string) => {
      const textarea = bodyTextareaRef.current;
      const currentBody = bodyRef.current;

      if (!textarea) {
        handleBodyChange(
          `${currentBody}${currentBody ? "\n\n" : ""}${snippet}`,
        );
        return;
      }

      const selectionStart = textarea.selectionStart ?? currentBody.length;
      const selectionEnd = textarea.selectionEnd ?? currentBody.length;
      const before = currentBody.slice(0, selectionStart);
      const after = currentBody.slice(selectionEnd);
      const needsLeadingSpace = before.length > 0 && !before.endsWith("\n");
      const needsTrailingSpace = after.length > 0 && !after.startsWith("\n");
      const prefix = needsLeadingSpace ? "\n\n" : "";
      const suffix = needsTrailingSpace ? "\n" : "";
      const nextBody = `${before}${prefix}${snippet}${suffix}${after}`;

      handleBodyChange(nextBody);

      requestAnimationFrame(() => {
        const cursor = before.length + prefix.length + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [handleBodyChange],
  );

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      setIsUploading(true);

      try {
        const uploadedUrls = await Promise.all(
          acceptedFiles.map((file) => uploadImageToCloudinary(file)),
        );
        const markdown = acceptedFiles
          .map((file, index) => {
            const url = uploadedUrls[index];
            return url ? buildMarkdownImage(file, url) : null;
          })
          .filter((value): value is string => value !== null)
          .join("\n\n");

        insertAtCursor(markdown);
      } catch {
        // ignore upload errors to avoid breaking the editor flow
      } finally {
        setIsUploading(false);
      }
    },
    [buildMarkdownImage, insertAtCursor, uploadImageToCloudinary],
  );

  const dropzoneConfig = useMemo(
    () => ({
      accept: { "image/*": [] },
      multiple: true,
      noClick: true,
      noKeyboard: true,
      onDrop: handleDrop,
    }),
    [handleDrop],
  );

  const { getInputProps, getRootProps, isDragActive } =
    useDropzone(dropzoneConfig);

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
        index: indexEnabled,
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
    indexEnabled,
    publishedAt,
    summary,
    tags,
    title,
    enableHatenaSync,
    hatenaEnabled,
    enableZennSync,
    zennEnabled,
    zennSlug,
    zennType,
  ]);

  const handleSummaryChange = useCallback((value: string) => {
    setSummary(value);
    summaryRef.current = value;
    const isEmpty = value.trim().length === 0;
    const nextMode = isEmpty ? "auto" : "manual";
    setSummaryMode(nextMode);
    summaryModeRef.current = nextMode;
  }, []);

  const addTagsFromInput = useCallback((inputValue: string) => {
    const parts = inputValue
      .split(/[,、\n]/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0);

    if (parts.length === 0) {
      return;
    }

    setTags((prev) => {
      const existing = new Set(prev.map((tag) => tag.toLowerCase()));
      const next = [...prev];
      for (const part of parts) {
        const key = part.toLowerCase();
        if (existing.has(key)) {
          continue;
        }
        existing.add(key);
        next.push(part);
      }
      return next;
    });
    setTagInputValue("");
  }, []);

  const handleTagInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        addTagsFromInput(event.currentTarget.value);
      }
    },
    [addTagsFromInput],
  );

  const handleTagInputBlur = useCallback(() => {
    if (tagInputValue.trim().length > 0) {
      addTagsFromInput(tagInputValue);
    }
  }, [addTagsFromInput, tagInputValue]);

  const handleTagSuggestionClick = useCallback(
    (tag: string) => {
      addTagsFromInput(tag);
    },
    [addTagsFromInput],
  );

  const handleTagRemove = (tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  };
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
    summaryRef.current = summary;
    summaryModeRef.current = summaryMode;
  }, [body, summary, summaryMode]);

  useEffect(() => {
    if (initialAppliedRef.current) {
      return;
    }

    const hasInitialValues =
      initialBody !== undefined ||
      initialIndex !== undefined ||
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
      const nextMode = initialSummary.trim().length > 0 ? "manual" : "auto";
      setSummary(initialSummary);
      setSummaryMode(nextMode);
      summaryRef.current = initialSummary;
      summaryModeRef.current = nextMode;
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

    if (initialIndex !== undefined) {
      setIndexEnabled(initialIndex);
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
    initialIndex,
    initialTitle,
    initialHatenaEnabled,
    initialZennEnabled,
    initialZennType,
    onBodyChange,
    setTitle,
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
    indexEnabled,
    isCreatingPullRequest,
    isDragActive,
    isLoading,
    isPreviewLoading,
    onBodyChange: handleBodyChange,
    onCreatePullRequest: onCreatePullRequest
      ? handleCreatePullRequest
      : undefined,
    onHatenaEnabledChange: enableHatenaSync ? setHatenaEnabled : undefined,
    onIndexChange: setIndexEnabled,
    onPublishedAtChange: setPublishedAt,
    onResolveLinkTitles: handleResolveLinkTitles,
    onSummaryChange: handleSummaryChange,
    onTagInputBlur: handleTagInputBlur,
    onTagInputChange: setTagInputValue,
    onTagInputKeyDown: handleTagInputKeyDown,
    onTagRemove: handleTagRemove,
    onTagSuggestionClick: handleTagSuggestionClick,
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

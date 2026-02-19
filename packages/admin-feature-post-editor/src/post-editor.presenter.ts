"use client";

import type { SerializeResult } from "next-mdx-remote-client";

import { formatDate, hasFrontmatter } from "@repo/util";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { buildSummaryFromBody, generateZennSlug } from "./libs";
import { useImageDropzone } from "./post-editor.image-dropzone";
import { usePostEditorTags } from "./post-editor.tags";

type CreatePullRequestAction =
  | { message: string; type: "alert" }
  | { type: "clearDraft" }
  | { type: "open"; url: string }
  | { type: "redirect"; url: string };

type Props = {
  createPullRequestDisabled?: boolean;
  enableHatenaSync?: boolean;
  enableZennSync?: boolean;
  initialAutoCreatePullRequest?: boolean;
  initialBody?: string;
  initialDraftId?: string;
  initialHatenaEnabled?: boolean;
  initialPublishedAt?: string;
  initialSummary?: string;
  initialTags?: string[];
  initialTitle?: string;
  initialZennEnabled?: boolean;
  initialZennType?: string;
  onCreatePullRequest?: (draft: {
    body: string;
    draftId?: string;
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
    actions?: CreatePullRequestAction[];
  }>;
  onSaveDraft?: (draft: {
    body: string;
    hatenaEnabled: boolean;
    id?: string;
    publishedAt: string;
    summary: string;
    tags: string[];
    title: string;
    zennEnabled: boolean;
    zennType: string;
  }) => Promise<void | {
    actions?: Array<{ message: string; type: "alert" }>;
    id?: string;
  }>;
  resolveLinkTitles: (source: string) => Promise<string>;
  resolvePreview: (source: string) => Promise<SerializeResult>;
  tagSuggestions?: string[];
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
};

const POST_DRAFTS_STORAGE_KEY = "silverbirder-admin-post-drafts";

type LocalDraft = {
  body: string;
  hatenaEnabled: boolean;
  id: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  title: string;
  updatedAt: string;
  zennEnabled: boolean;
  zennType: string;
};

const sortLocalDrafts = (drafts: LocalDraft[]): LocalDraft[] => {
  return [...drafts].sort((left, right) => {
    const leftDate = Date.parse(left.updatedAt);
    const rightDate = Date.parse(right.updatedAt);
    const leftValue = Number.isNaN(leftDate) ? 0 : leftDate;
    const rightValue = Number.isNaN(rightDate) ? 0 : rightDate;

    if (rightValue !== leftValue) {
      return rightValue - leftValue;
    }

    return left.id.localeCompare(right.id);
  });
};

const isLocalDraft = (value: unknown): value is LocalDraft => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<LocalDraft>;
  return (
    typeof candidate.body === "string" &&
    typeof candidate.hatenaEnabled === "boolean" &&
    typeof candidate.id === "string" &&
    candidate.id.length > 0 &&
    typeof candidate.publishedAt === "string" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every((tag) => typeof tag === "string") &&
    typeof candidate.title === "string" &&
    typeof candidate.updatedAt === "string" &&
    typeof candidate.zennEnabled === "boolean" &&
    typeof candidate.zennType === "string"
  );
};

const readLocalDrafts = (): LocalDraft[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(POST_DRAFTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return sortLocalDrafts(parsed.filter(isLocalDraft));
  } catch {
    return [];
  }
};

const writeLocalDrafts = (drafts: LocalDraft[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(
    POST_DRAFTS_STORAGE_KEY,
    JSON.stringify(sortLocalDrafts(drafts)),
  );
};

const findLocalDraft = (id: string) =>
  readLocalDrafts().find((draft) => draft.id === id) ?? null;

const upsertLocalDraft = (draft: LocalDraft) => {
  const drafts = readLocalDrafts().filter((entry) => entry.id !== draft.id);
  drafts.push(draft);
  writeLocalDrafts(drafts);
};

const removeLocalDraft = (id: string) => {
  const drafts = readLocalDrafts().filter((entry) => entry.id !== id);
  writeLocalDrafts(drafts);
};

const removeDraftQueryParamsFromUrl = () => {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  const hasDraftId = url.searchParams.has("draftId");
  const hasResumePullRequest = url.searchParams.has("resumePullRequest");

  if (!hasDraftId && !hasResumePullRequest) {
    return;
  }

  url.searchParams.delete("draftId");
  url.searchParams.delete("resumePullRequest");
  window.history.replaceState(null, "", url.toString());
};

const createDraftId = () => {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const usePostEditorPresenter = ({
  createPullRequestDisabled,
  enableHatenaSync = false,
  enableZennSync = false,
  initialAutoCreatePullRequest = false,
  initialBody,
  initialDraftId,
  initialHatenaEnabled,
  initialPublishedAt,
  initialSummary,
  initialTags,
  initialTitle,
  initialZennEnabled,
  initialZennType,
  onCreatePullRequest,
  onSaveDraft,
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
  const [draftId, setDraftId] = useState(initialDraftId);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isResumingPullRequestFlow, setIsResumingPullRequestFlow] = useState(
    initialAutoCreatePullRequest,
  );
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
  const autoCreateHandledRef = useRef(false);

  const bodyRef = useRef(body);
  const initialAppliedRef = useRef(false);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastPreviewedBodyRef = useRef<null | string>(null);

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

  const updateSummaryFromBody = useCallback((value: string) => {
    const nextSummary = buildSummaryFromBody(value);
    setSummary(nextSummary);
  }, []);

  const handleBodyChange = useCallback(
    (value: string) => {
      setBody(value);
      bodyRef.current = value;
      updateSummaryFromBody(value);
    },
    [updateSummaryFromBody],
  );

  const handlePreviewRequest = useCallback(async () => {
    const currentBody = bodyRef.current;
    if (currentBody.length === 0) {
      setPreviewSource(null);
      setIsPreviewLoading(false);
      lastPreviewedBodyRef.current = currentBody;
      return;
    }

    if (lastPreviewedBodyRef.current === currentBody) {
      return;
    }

    setIsPreviewLoading(true);

    try {
      const data = await resolvePreview(currentBody);
      setPreviewSource(data ?? null);
    } catch {
      setPreviewSource(null);
    } finally {
      setIsPreviewLoading(false);
      lastPreviewedBodyRef.current = currentBody;
    }
  }, [resolvePreview]);

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
    isSavingDraft ||
    !onCreatePullRequest ||
    (enableHatenaSync && hatenaEnabled && title.length === 0) ||
    (enableZennSync &&
      zennEnabled &&
      (zennSlug.length === 0 || zennType.length === 0 || title.length === 0));

  const isLoading =
    isUploading || isResolvingLinks || isCreatingPullRequest || isSavingDraft;

  const handleCreatePullRequest = useCallback(async () => {
    if (!onCreatePullRequest || createPullRequestIsDisabled) {
      return;
    }

    const currentDraftId = draftId ?? createDraftId();
    if (!draftId) {
      setDraftId(currentDraftId);
    }

    upsertLocalDraft({
      body: bodyRef.current,
      hatenaEnabled: enableHatenaSync && hatenaEnabled,
      id: currentDraftId,
      publishedAt,
      summary,
      tags,
      title,
      updatedAt: new Date().toISOString(),
      zennEnabled: enableZennSync && zennEnabled,
      zennType,
    });

    setIsCreatingPullRequest(true);
    let isRedirecting = false;

    try {
      const result = await onCreatePullRequest({
        body: bodyRef.current,
        draftId: currentDraftId,
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
          if (action?.type === "clearDraft") {
            removeLocalDraft(currentDraftId);
            setDraftId(undefined);
            removeDraftQueryParamsFromUrl();
          }
          if (action?.type === "open") {
            window.open(action.url, "_blank", "noopener,noreferrer");
          }
          if (action?.type === "redirect") {
            isRedirecting = true;
            setIsResumingPullRequestFlow(true);
            window.location.assign(action.url);
            return;
          }
          if (action?.type === "alert") {
            window.alert(action.message);
          }
        }
      }
    } finally {
      setIsCreatingPullRequest(false);
      if (!isRedirecting) {
        setIsResumingPullRequestFlow(false);
      }
    }
  }, [
    createPullRequestIsDisabled,
    draftId,
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

  const handleSaveDraft = useCallback(async () => {
    if (!onSaveDraft || isUploading || isResolvingLinks) {
      return;
    }

    setIsSavingDraft(true);

    try {
      const result = await onSaveDraft({
        body: bodyRef.current,
        hatenaEnabled: enableHatenaSync && hatenaEnabled,
        id: draftId,
        publishedAt,
        summary,
        tags,
        title,
        zennEnabled: enableZennSync && zennEnabled,
        zennType,
      });

      let nextDraftId = draftId;

      if (
        result &&
        typeof result === "object" &&
        "id" in result &&
        typeof result.id === "string"
      ) {
        nextDraftId = result.id;
      }

      if (!nextDraftId) {
        nextDraftId = createDraftId();
      }

      setDraftId(nextDraftId);

      const updatedAt = new Date().toISOString();
      const nextDraft: LocalDraft = {
        body: bodyRef.current,
        hatenaEnabled: enableHatenaSync && hatenaEnabled,
        id: nextDraftId,
        publishedAt,
        summary,
        tags,
        title,
        updatedAt,
        zennEnabled: enableZennSync && zennEnabled,
        zennType,
      };
      const nextDrafts = readLocalDrafts().filter(
        (entry) => entry.id !== nextDraftId,
      );
      nextDrafts.push(nextDraft);
      writeLocalDrafts(nextDrafts);

      if (
        result &&
        typeof result === "object" &&
        "actions" in result &&
        Array.isArray(result.actions)
      ) {
        for (const action of result.actions) {
          if (action?.type === "alert") {
            window.alert(action.message);
          }
        }
      }
    } finally {
      setIsSavingDraft(false);
    }
  }, [
    onSaveDraft,
    isUploading,
    isResolvingLinks,
    enableHatenaSync,
    hatenaEnabled,
    draftId,
    publishedAt,
    summary,
    tags,
    title,
    enableZennSync,
    zennEnabled,
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

    const localDraft =
      initialDraftId && !hasInitialValues
        ? findLocalDraft(initialDraftId)
        : null;

    if (!hasInitialValues && !localDraft) {
      return;
    }

    if (localDraft && !hasInitialValues) {
      setTitle(localDraft.title);
      setSummary(localDraft.summary);
      setTags(localDraft.tags);
      setHatenaEnabled(localDraft.hatenaEnabled);
      setZennEnabled(localDraft.zennEnabled);
      setZennType(localDraft.zennType);
      setPublishedAt(localDraft.publishedAt);
      setBody(localDraft.body);
      bodyRef.current = localDraft.body;
      setDraftId(localDraft.id);
      initialAppliedRef.current = true;
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
      setBody(initialBody);
      bodyRef.current = initialBody;
      updateSummaryFromBody(initialBody);
    }

    initialAppliedRef.current = true;
  }, [
    initialBody,
    initialDraftId,
    initialPublishedAt,
    initialSummary,
    initialTags,
    initialTitle,
    initialHatenaEnabled,
    initialZennEnabled,
    initialZennType,
    updateSummaryFromBody,
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

  useEffect(() => {
    setDraftId(initialDraftId);
  }, [initialDraftId]);

  useEffect(() => {
    if (!initialAutoCreatePullRequest) {
      return;
    }
    if (autoCreateHandledRef.current) {
      return;
    }
    if (!onCreatePullRequest || createPullRequestIsDisabled) {
      return;
    }

    autoCreateHandledRef.current = true;
    setIsResumingPullRequestFlow(true);
    void handleCreatePullRequest();

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("resumePullRequest")) {
        url.searchParams.delete("resumePullRequest");
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [
    initialAutoCreatePullRequest,
    onCreatePullRequest,
    createPullRequestIsDisabled,
    handleCreatePullRequest,
  ]);

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
    isSavingDraft,
    onBodyChange: handleBodyChange,
    onCreatePullRequest: onCreatePullRequest
      ? handleCreatePullRequest
      : undefined,
    onHatenaEnabledChange: enableHatenaSync ? setHatenaEnabled : undefined,
    onPreviewRequest: handlePreviewRequest,
    onPublishedAtChange: setPublishedAt,
    onResolveLinkTitles: handleResolveLinkTitles,
    onSaveDraft: onSaveDraft ? handleSaveDraft : undefined,
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
    showPullRequestFlowNotice: isResumingPullRequestFlow,
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

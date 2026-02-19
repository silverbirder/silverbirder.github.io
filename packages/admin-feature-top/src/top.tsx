"use client";

import { Box, chakra, Container, Stack } from "@chakra-ui/react";
import { Link as UiLink } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DraftSummary = {
  id: string;
  publishedAt: string;
  title: string;
  updatedAt: string;
};

type DraftSyncAction =
  | { drafts: LocalDraft[]; type: "replaceLocalDrafts" }
  | { message: string; type: "alert" }
  | { type: "redirect"; url: string };

type LocalDraft = DraftSummary & {
  body: string;
  hatenaEnabled: boolean;
  summary: string;
  tags: string[];
  zennEnabled: boolean;
  zennType: string;
};

type Props = {
  drafts?: DraftSummary[];
  initialResumeDraftSync?: "pull" | "push";
  onDeleteDraft?: (formData: FormData) => Promise<void> | void;
  onPullDrafts?: () => Promise<void | { actions?: DraftSyncAction[] }>;
  onPushDrafts?: (input: {
    drafts: LocalDraft[];
  }) => Promise<void | { actions?: DraftSyncAction[] }>;
};

const POST_DRAFTS_STORAGE_KEY = "silverbirder-admin-post-drafts";

const SyncButton = chakra("button", {
  base: {
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.6,
    },
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "green.focusRing",
      outlineOffset: "2px",
    },
    _hover: {
      background: "green.muted",
    },
    alignItems: "center",
    background: "green.subtle",
    borderColor: "green.muted",
    borderRadius: "999px",
    borderWidth: "1px",
    color: "green.fg",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: "0.85rem",
    fontWeight: "600",
    paddingBlock: "0.4rem",
    paddingInline: "1rem",
    transition: "background 0.2s ease",
  },
});

const formatUpdatedAt = (value: string) => {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return value;
  }
  return new Intl.DateTimeFormat("ja-JP", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(timestamp));
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

const toUpdatedAtValue = (value: string) => {
  const dateValue = Date.parse(value);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

const sortDraftSummaries = (drafts: DraftSummary[]) => {
  return [...drafts].sort((left, right) => {
    const leftValue = toUpdatedAtValue(left.updatedAt);
    const rightValue = toUpdatedAtValue(right.updatedAt);
    if (rightValue !== leftValue) {
      return rightValue - leftValue;
    }
    return left.id.localeCompare(right.id);
  });
};

const sortLocalDrafts = (drafts: LocalDraft[]) => {
  return [...drafts].sort((left, right) => {
    const leftValue = toUpdatedAtValue(left.updatedAt);
    const rightValue = toUpdatedAtValue(right.updatedAt);
    if (rightValue !== leftValue) {
      return rightValue - leftValue;
    }
    return left.id.localeCompare(right.id);
  });
};

const toDraftSummary = (draft: LocalDraft): DraftSummary => ({
  id: draft.id,
  publishedAt: draft.publishedAt,
  title: draft.title,
  updatedAt: draft.updatedAt,
});

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

const mergeDrafts = (
  serverDrafts: DraftSummary[],
  localDrafts: DraftSummary[],
) => {
  const merged = new Map<string, DraftSummary>();
  for (const draft of serverDrafts) {
    merged.set(draft.id, draft);
  }
  for (const draft of localDrafts) {
    const existing = merged.get(draft.id);
    if (!existing) {
      merged.set(draft.id, draft);
      continue;
    }
    const existingValue = toUpdatedAtValue(existing.updatedAt);
    const localValue = toUpdatedAtValue(draft.updatedAt);
    if (localValue >= existingValue) {
      merged.set(draft.id, draft);
    }
  }
  return sortDraftSummaries([...merged.values()]);
};

const mergeLocalDrafts = (
  existingDrafts: LocalDraft[],
  nextDrafts: LocalDraft[],
) => {
  const merged = new Map<string, LocalDraft>();
  for (const draft of existingDrafts) {
    merged.set(draft.id, draft);
  }
  for (const draft of nextDrafts) {
    const existing = merged.get(draft.id);
    if (!existing) {
      merged.set(draft.id, draft);
      continue;
    }
    const existingValue = toUpdatedAtValue(existing.updatedAt);
    const nextValue = toUpdatedAtValue(draft.updatedAt);
    if (nextValue >= existingValue) {
      merged.set(draft.id, draft);
    }
  }
  return sortLocalDrafts([...merged.values()]);
};

const removeLocalDraft = (draftId: string) => {
  const drafts = readLocalDrafts().filter((draft) => draft.id !== draftId);
  writeLocalDrafts(drafts);
};

const removeResumeDraftSyncFromUrl = () => {
  if (typeof window === "undefined") {
    return;
  }
  const url = new URL(window.location.href);
  if (!url.searchParams.has("resumeDraftSync")) {
    return;
  }
  url.searchParams.delete("resumeDraftSync");
  window.history.replaceState(null, "", url.toString());
};

export const Top = ({
  drafts = [],
  initialResumeDraftSync,
  onDeleteDraft,
  onPullDrafts,
  onPushDrafts,
}: Props) => {
  const t = useTranslations("admin.home");
  const [isPullingDrafts, setIsPullingDrafts] = useState(false);
  const [isPushingDrafts, setIsPushingDrafts] = useState(false);
  const [displayDrafts, setDisplayDrafts] = useState<DraftSummary[]>(() =>
    sortDraftSummaries(drafts),
  );
  const resumeHandledRef = useRef(false);

  const sortedDrafts = useMemo(() => sortDraftSummaries(drafts), [drafts]);

  const updateDisplayDrafts = useCallback(
    (localDrafts: LocalDraft[]) => {
      setDisplayDrafts(
        mergeDrafts(
          sortedDrafts,
          sortDraftSummaries(localDrafts.map(toDraftSummary)),
        ),
      );
    },
    [sortedDrafts],
  );

  const applyDraftSyncActions = useCallback(
    (actions?: DraftSyncAction[]) => {
      if (!Array.isArray(actions)) {
        return false;
      }

      for (const action of actions) {
        if (!action) {
          continue;
        }
        if (action.type === "replaceLocalDrafts") {
          const nextDrafts = mergeLocalDrafts(
            readLocalDrafts(),
            action.drafts.filter(isLocalDraft),
          );
          writeLocalDrafts(nextDrafts);
          updateDisplayDrafts(nextDrafts);
          continue;
        }
        if (action.type === "alert") {
          window.alert(action.message);
          continue;
        }
        if (action.type === "redirect") {
          window.location.assign(action.url);
          return true;
        }
      }
      return false;
    },
    [updateDisplayDrafts],
  );

  const handlePushDrafts = useCallback(async () => {
    if (!onPushDrafts || isPushingDrafts || isPullingDrafts) {
      return;
    }
    setIsPushingDrafts(true);
    try {
      const result = await onPushDrafts({
        drafts: readLocalDrafts(),
      });
      const redirected = applyDraftSyncActions(result?.actions);
      if (!redirected) {
        removeResumeDraftSyncFromUrl();
      }
    } finally {
      setIsPushingDrafts(false);
    }
  }, [onPushDrafts, isPushingDrafts, isPullingDrafts, applyDraftSyncActions]);

  const handlePullDrafts = useCallback(async () => {
    if (!onPullDrafts || isPullingDrafts || isPushingDrafts) {
      return;
    }
    setIsPullingDrafts(true);
    try {
      const result = await onPullDrafts();
      const redirected = applyDraftSyncActions(result?.actions);
      if (!redirected) {
        removeResumeDraftSyncFromUrl();
      }
    } finally {
      setIsPullingDrafts(false);
    }
  }, [onPullDrafts, isPullingDrafts, isPushingDrafts, applyDraftSyncActions]);

  useEffect(() => {
    updateDisplayDrafts(readLocalDrafts());
  }, [updateDisplayDrafts]);

  useEffect(() => {
    if (resumeHandledRef.current) {
      return;
    }
    if (initialResumeDraftSync === "push" && onPushDrafts) {
      resumeHandledRef.current = true;
      void handlePushDrafts();
      return;
    }
    if (initialResumeDraftSync === "pull" && onPullDrafts) {
      resumeHandledRef.current = true;
      void handlePullDrafts();
    }
  }, [
    initialResumeDraftSync,
    onPushDrafts,
    onPullDrafts,
    handlePushDrafts,
    handlePullDrafts,
  ]);

  return (
    <Box as="main" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <Stack align="stretch" gap={6}>
          <Box alignItems="center" display="flex" flexWrap="wrap" gap={3}>
            <UiLink data-testid="admin-new-post-link" href="/posts/new">
              {t("newPostAction")}
            </UiLink>
            {onPushDrafts ? (
              <SyncButton
                data-testid="admin-draft-sync-push"
                disabled={isPushingDrafts || isPullingDrafts}
                onClick={() => {
                  void handlePushDrafts();
                }}
                type="button"
              >
                {isPushingDrafts
                  ? t("draftSyncPushLoading")
                  : t("draftSyncPushAction")}
              </SyncButton>
            ) : null}
            {onPullDrafts ? (
              <SyncButton
                data-testid="admin-draft-sync-pull"
                disabled={isPullingDrafts || isPushingDrafts}
                onClick={() => {
                  void handlePullDrafts();
                }}
                type="button"
              >
                {isPullingDrafts
                  ? t("draftSyncPullLoading")
                  : t("draftSyncPullAction")}
              </SyncButton>
            ) : null}
          </Box>
          <Stack gap={3}>
            <Box as="h2">{t("draftSectionTitle")}</Box>
            {displayDrafts.length === 0 ? (
              <Box color="muted" data-testid="admin-draft-empty">
                {t("draftEmpty")}
              </Box>
            ) : (
              displayDrafts.map((draft) => (
                <Box data-testid="admin-draft-item" key={draft.id}>
                  <Stack gap={3}>
                    <Box>
                      {draft.title.length > 0
                        ? draft.title
                        : t("draftUntitled")}
                    </Box>
                    <Box>
                      {t("draftUpdatedAt", {
                        updatedAt: formatUpdatedAt(draft.updatedAt),
                      })}
                    </Box>
                    <Box alignItems="center" display="flex">
                      <UiLink
                        href={`/posts/new?draftId=${encodeURIComponent(draft.id)}`}
                      >
                        {t("draftEditAction")}
                      </UiLink>
                      {onDeleteDraft ? (
                        <form action={onDeleteDraft}>
                          <input
                            name="draftId"
                            type="hidden"
                            value={draft.id}
                          />
                          <button
                            data-testid={`admin-draft-delete-${draft.id}`}
                            onClick={() => {
                              removeLocalDraft(draft.id);
                              updateDisplayDrafts(readLocalDrafts());
                            }}
                            type="submit"
                          >
                            {t("draftDeleteAction")}
                          </button>
                        </form>
                      ) : null}
                    </Box>
                  </Stack>
                </Box>
              ))
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

"use client";

import { Box, Container, Stack } from "@chakra-ui/react";
import { Link as UiLink } from "@repo/ui";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

type DraftSummary = {
  id: string;
  publishedAt: string;
  title: string;
  updatedAt: string;
};

type Props = {
  drafts?: DraftSummary[];
  onDeleteDraft?: (formData: FormData) => Promise<void> | void;
};

const POST_DRAFTS_STORAGE_KEY = "silverbirder-admin-post-drafts";

type LocalDraft = DraftSummary & {
  body: string;
  hatenaEnabled: boolean;
  summary: string;
  tags: string[];
  zennEnabled: boolean;
  zennType: string;
};

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

const sortDrafts = (drafts: DraftSummary[]) => {
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

const readLocalDraftSummaries = (): DraftSummary[] => {
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
    return sortDrafts(
      parsed.filter(isLocalDraft).map((draft) => ({
        id: draft.id,
        publishedAt: draft.publishedAt,
        title: draft.title,
        updatedAt: draft.updatedAt,
      })),
    );
  } catch {
    return [];
  }
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
    const existingTime = Date.parse(existing.updatedAt);
    const localTime = Date.parse(draft.updatedAt);
    const existingValue = Number.isNaN(existingTime) ? 0 : existingTime;
    const localValue = Number.isNaN(localTime) ? 0 : localTime;
    if (localValue >= existingValue) {
      merged.set(draft.id, draft);
    }
  }
  return sortDrafts([...merged.values()]);
};

const removeLocalDraft = (draftId: string) => {
  if (typeof window === "undefined") {
    return;
  }
  const localDrafts = readLocalDraftSummaries().filter(
    (draft) => draft.id !== draftId,
  );
  const raw = window.localStorage.getItem(POST_DRAFTS_STORAGE_KEY);
  if (!raw) {
    return;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return;
    }
    const filtered = parsed.filter(
      (draft) =>
        typeof draft === "object" &&
        draft !== null &&
        "id" in draft &&
        draft.id !== draftId,
    );
    window.localStorage.setItem(
      POST_DRAFTS_STORAGE_KEY,
      JSON.stringify(filtered),
    );
  } catch {
    window.localStorage.setItem(
      POST_DRAFTS_STORAGE_KEY,
      JSON.stringify(localDrafts),
    );
  }
};

export const Top = ({ drafts = [], onDeleteDraft }: Props) => {
  const t = useTranslations("admin.home");
  const [displayDrafts, setDisplayDrafts] = useState<DraftSummary[]>(() =>
    sortDrafts(drafts),
  );

  const sortedDrafts = useMemo(() => sortDrafts(drafts), [drafts]);

  useEffect(() => {
    const localDrafts = readLocalDraftSummaries();
    setDisplayDrafts(mergeDrafts(sortedDrafts, localDrafts));
  }, [sortedDrafts]);

  return (
    <Box as="main" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <Stack align="stretch" gap={6}>
          <UiLink data-testid="admin-new-post-link" href="/posts/new">
            {t("newPostAction")}
          </UiLink>
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
                            onClick={() => removeLocalDraft(draft.id)}
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

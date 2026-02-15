"use client";

import { Box, Container, Stack } from "@chakra-ui/react";
import { Link as UiLink } from "@repo/ui";
import { useTranslations } from "next-intl";

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

export const Top = ({ drafts = [], onDeleteDraft }: Props) => {
  const t = useTranslations("admin.home");

  return (
    <Box as="main" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <Stack align="stretch" gap={6}>
          <UiLink data-testid="admin-new-post-link" href="/posts/new">
            {t("newPostAction")}
          </UiLink>
          <Stack gap={3}>
            <Box as="h2">{t("draftSectionTitle")}</Box>
            {drafts.length === 0 ? (
              <Box color="muted" data-testid="admin-draft-empty">
                {t("draftEmpty")}
              </Box>
            ) : (
              drafts.map((draft) => (
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

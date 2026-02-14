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

const linkButton = {
  alignItems: "center",
  borderRadius: "0.75rem",
  color: "white",
  display: "inline-flex",
  fontSize: "0.95rem",
  fontWeight: "600",
  gap: "0.4rem",
  paddingBlock: "0.6rem",
  paddingInline: "1.2rem",
  textDecoration: "none",
  transition: "background 0.2s ease",
} as const;

const draftCard = {
  borderColor: "green.muted",
  borderRadius: "0.75rem",
  borderWidth: "1px",
  padding: "1rem",
  width: "100%",
} as const;

const deleteButton = {
  background: "green.subtle",
  borderColor: "green.muted",
  borderRadius: "999px",
  borderWidth: "1px",
  color: "green.fg",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: "600",
  paddingBlock: "0.35rem",
  paddingInline: "0.85rem",
} as const;

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
    <Box as="main" bg="bg" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="6xl">
        <Stack align="stretch" gap={6}>
          <UiLink
            {...linkButton}
            data-testid="admin-new-post-link"
            href="/posts/new"
          >
            {t("newPostAction")}
          </UiLink>
          <Stack gap={3}>
            <Box as="h2" color="fg" fontSize="1.1rem" fontWeight="700">
              {t("draftSectionTitle")}
            </Box>
            {drafts.length === 0 ? (
              <Box
                color="muted"
                data-testid="admin-draft-empty"
                fontSize="0.9rem"
              >
                {t("draftEmpty")}
              </Box>
            ) : (
              drafts.map((draft) => (
                <Box
                  {...draftCard}
                  data-testid="admin-draft-item"
                  key={draft.id}
                >
                  <Stack gap={3}>
                    <Box color="fg" fontWeight="600">
                      {draft.title.length > 0
                        ? draft.title
                        : t("draftUntitled")}
                    </Box>
                    <Box color="muted" fontSize="0.85rem">
                      {t("draftUpdatedAt", {
                        updatedAt: formatUpdatedAt(draft.updatedAt),
                      })}
                    </Box>
                    <Box alignItems="center" display="flex" gap="0.75rem">
                      <UiLink
                        {...linkButton}
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
                            style={deleteButton}
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

"use client";

import type { SerializeResult } from "next-mdx-remote-client";

import {
  buildSummaryFromBody,
  PostEditor,
} from "@repo/admin-feature-post-editor";
import { useTranslations } from "next-intl";

import { api } from "@/trpc/react";

type Props = {
  resolveLinkTitles: (source: string) => Promise<string>;
  resolvePreview: (source: string) => Promise<SerializeResult>;
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
};

const hasFrontmatter = (source: string) => {
  const trimmed = source.trimStart();
  if (!trimmed.startsWith("---")) {
    return false;
  }
  return /^---\n[\s\S]*?\n---\n/.test(trimmed);
};

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const formatDailyBaseName = (date: Date) => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

const getUniqueDailyFileName = (existingFileNames: string[], date: Date) => {
  const base = formatDailyBaseName(date);
  const normalized = new Set(
    existingFileNames.map((name) => name.toLowerCase()),
  );
  const primary = `${base}.md`;

  if (!normalized.has(primary.toLowerCase())) {
    return primary;
  }

  for (let index = 2; index < 100; index += 1) {
    const candidate = `${base}-${index}.md`;
    if (!normalized.has(candidate.toLowerCase())) {
      return candidate;
    }
  }

  return `${base}-${Date.now()}.md`;
};

const escapeYamlSingleQuotedString = (value: string) =>
  value.replace(/'/g, "''");

const formatTags = (tags: string[]) => {
  const normalized = Array.from(
    new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
  );
  if (normalized.length === 0) {
    return "[]";
  }
  const escaped = normalized.map(
    (tag) => `'${escapeYamlSingleQuotedString(tag)}'`,
  );
  return `[${escaped.join(", ")}]`;
};

const buildMarkdown = (
  draft: { body: string; summary: string; tags: string[]; title: string },
  date: Date,
) => {
  if (hasFrontmatter(draft.body)) {
    return draft.body.trimStart();
  }

  const title = escapeYamlSingleQuotedString(draft.title);
  const summary =
    draft.summary.trim().length > 0
      ? escapeYamlSingleQuotedString(draft.summary.trim())
      : escapeYamlSingleQuotedString(buildSummaryFromBody(draft.body));
  const publishedAt = formatDate(date);
  const body = draft.body;
  const tags = formatTags(draft.tags);

  return `---\ntitle: '${title}'\npublishedAt: '${publishedAt}'\nsummary: '${summary}'\ntags: ${tags}\nindex: false\n---\n\n${body}\n`;
};

export const PostEditorWithPullRequest = ({
  resolveLinkTitles,
  resolvePreview,
  uploadImage,
}: Props) => {
  const t = useTranslations("admin.postEditor");
  const postsQuery = api.github.list.useQuery();
  const tagsQuery = api.github.listTags.useQuery();
  const createPullRequestMutation = api.github.createPullRequest.useMutation();

  return (
    <PostEditor
      createPullRequestDisabled={
        postsQuery.isLoading ||
        postsQuery.isError ||
        createPullRequestMutation.isPending
      }
      onCreatePullRequest={async (draft) => {
        const date = new Date();
        const existingPosts = postsQuery.data ?? [];
        const fileName = getUniqueDailyFileName(existingPosts, date);
        const content = buildMarkdown(draft, date);

        try {
          const result = await createPullRequestMutation.mutateAsync({
            content,
            fileName,
            pullRequestTitle: draft.title.length > 0 ? draft.title : undefined,
          });

          if (result.url) {
            window.open(result.url, "_blank", "noopener,noreferrer");
            return;
          }

          window.alert(t("createPullRequestError"));
        } catch {
          window.alert(t("createPullRequestError"));
        }
      }}
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      tagSuggestions={tagsQuery.data ?? []}
      uploadImage={uploadImage}
    />
  );
};

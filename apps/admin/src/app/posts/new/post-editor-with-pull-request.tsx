"use client";

import type { SerializeResult } from "next-mdx-remote-client";

import { PostEditor } from "@repo/admin-feature-post-editor";
import { useTranslations } from "next-intl";

import { api } from "@/trpc/react";

import {
  buildMarkdown,
  getUniqueDailyFileName,
  parsePublishedAtDate,
} from "../post-editor-markdown";
import { buildZennMarkdown } from "../post-editor-zenn-markdown";

type Props = {
  resolveLinkTitles: (source: string) => Promise<string>;
  resolvePreview: (source: string) => Promise<SerializeResult>;
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
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
  const createZennPullRequestMutation =
    api.zenn.createPullRequest.useMutation();
  const createHatenaDraftMutation = api.hatena.createDraft.useMutation();

  return (
    <PostEditor
      createPullRequestDisabled={
        postsQuery.isLoading ||
        postsQuery.isError ||
        createPullRequestMutation.isPending ||
        createZennPullRequestMutation.isPending ||
        createHatenaDraftMutation.isPending
      }
      enableHatenaSync
      enableZennSync
      onCreatePullRequest={async (draft) => {
        const date = parsePublishedAtDate(draft.publishedAt);
        const existingPosts = postsQuery.data ?? [];
        const fileName = getUniqueDailyFileName(existingPosts, date);
        const content = buildMarkdown(draft, date);
        const shouldSyncZenn = draft.zenn?.enabled === true;
        const shouldSyncHatena = draft.hatena?.enabled === true;

        try {
          const result = await createPullRequestMutation.mutateAsync({
            content,
            fileName,
            pullRequestTitle: draft.title.length > 0 ? draft.title : undefined,
          });

          if (shouldSyncZenn && draft.zenn) {
            try {
              const zennContent = buildZennMarkdown({
                body: draft.body,
                title: draft.title,
                topics: draft.zenn.topics,
                type: draft.zenn.type,
              });
              const zennResult =
                await createZennPullRequestMutation.mutateAsync({
                  content: zennContent,
                  fileName: draft.zenn.slug,
                  pullRequestTitle:
                    draft.title.length > 0 ? draft.title : undefined,
                });
              if (zennResult.url) {
                window.open(zennResult.url, "_blank", "noopener,noreferrer");
              } else {
                window.alert(t("createZennPullRequestError"));
              }
            } catch {
              window.alert(t("createZennPullRequestError"));
            }
          }

          if (shouldSyncHatena && draft.hatena) {
            try {
              const hatenaResult = await createHatenaDraftMutation.mutateAsync({
                body: draft.body,
                title: draft.title,
              });
              if (hatenaResult.previewUrl) {
                window.open(
                  hatenaResult.previewUrl,
                  "_blank",
                  "noopener,noreferrer",
                );
              } else if (hatenaResult.editUrl) {
                window.open(
                  hatenaResult.editUrl,
                  "_blank",
                  "noopener,noreferrer",
                );
              } else {
                window.alert(t("createHatenaPullRequestError"));
              }
            } catch {
              window.alert(t("createHatenaPullRequestError"));
            }
          }

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

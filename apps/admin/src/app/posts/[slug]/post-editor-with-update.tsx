"use client";

import type { SerializeResult } from "next-mdx-remote-client";

import { Box, Text } from "@chakra-ui/react";
import { PostEditor } from "@repo/admin-feature-post-editor";
import { useTranslations } from "next-intl";

import { api } from "@/trpc/react";

import { buildMarkdown, parsePublishedAtDate } from "../post-editor-markdown";

type Props = {
  resolveLinkTitles: (source: string) => Promise<string>;
  resolvePreview: (source: string) => Promise<SerializeResult>;
  slug: string;
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
};

export const PostEditorWithUpdate = ({
  resolveLinkTitles,
  resolvePreview,
  slug,
  uploadImage,
}: Props) => {
  const t = useTranslations("admin.postEditor");
  const normalizedSlug = slug?.trim() ?? "";
  const hasSlug = normalizedSlug.length > 0;
  const postQuery = api.github.getPost.useQuery(
    { slug: normalizedSlug },
    { enabled: hasSlug },
  );
  const tagsQuery = api.github.listTags.useQuery();
  const updatePullRequestMutation = api.github.updatePullRequest.useMutation();

  if (!hasSlug) {
    return (
      <Box padding={6}>
        <Text color="red.500">{t("loadError")}</Text>
      </Box>
    );
  }

  if (postQuery.isLoading) {
    return (
      <Box padding={6}>
        <Text color="fg.muted">{t("loading")}</Text>
      </Box>
    );
  }

  if (postQuery.isError) {
    return (
      <Box padding={6}>
        <Text color="red.500">{t("loadError")}</Text>
      </Box>
    );
  }

  const post = postQuery.data;

  return (
    <PostEditor
      createPullRequestDisabled={
        postQuery.isLoading ||
        postQuery.isError ||
        updatePullRequestMutation.isPending
      }
      initialBody={post?.body}
      initialPublishedAt={post?.publishedAt}
      initialSummary={post?.summary}
      initialTags={post?.tags}
      initialTitle={post?.title}
      key={slug}
      onCreatePullRequest={async (draft) => {
        const date = parsePublishedAtDate(draft.publishedAt);
        const content = buildMarkdown(draft, date);

        try {
          const result = await updatePullRequestMutation.mutateAsync({
            content,
            fileName: slug,
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

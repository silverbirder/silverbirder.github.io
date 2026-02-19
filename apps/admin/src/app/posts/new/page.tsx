import { PostEditor } from "@repo/admin-feature-post-editor";

import {
  createPostPullRequest,
  resolveLinkTitles,
  resolvePreview,
  savePostDraft,
  uploadImage,
} from "@/app/actions";
import { api } from "@/trpc/server";

type Props = {
  searchParams?: Promise<{
    draftId?: string;
    resumePullRequest?: string;
  }>;
};

export default async function Page({ searchParams }: Props = {}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const draftId = resolvedSearchParams?.draftId;
  const shouldResumePullRequest =
    resolvedSearchParams?.resumePullRequest === "1";
  const tagSuggestions = await api.github.listTags().catch(() => []);

  return (
    <PostEditor
      enableHatenaSync
      enableZennSync
      initialAutoCreatePullRequest={shouldResumePullRequest}
      initialDraftId={draftId}
      onCreatePullRequest={createPostPullRequest}
      onSaveDraft={savePostDraft}
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      tagSuggestions={tagSuggestions}
      uploadImage={uploadImage}
    />
  );
}

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
  }>;
};

export default async function Page({ searchParams }: Props = {}) {
  const tagSuggestions = await api.github.listTags();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const draftId = resolvedSearchParams?.draftId;

  return (
    <PostEditor
      enableHatenaSync
      enableZennSync
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

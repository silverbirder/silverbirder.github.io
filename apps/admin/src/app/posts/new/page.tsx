import { PostEditor } from "@repo/admin-feature-post-editor";

import {
  createPostPullRequest,
  fixMarkdownLint,
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
  const draft = draftId ? await api.draft.get({ id: draftId }) : null;

  return (
    <PostEditor
      enableHatenaSync
      enableZennSync
      fixMarkdownLint={fixMarkdownLint}
      initialBody={draft?.body}
      initialDraftId={draft?.id}
      initialHatenaEnabled={draft?.hatenaEnabled}
      initialPublishedAt={draft?.publishedAt}
      initialSummary={draft?.summary}
      initialTags={draft?.tags}
      initialTitle={draft?.title}
      initialZennEnabled={draft?.zennEnabled}
      initialZennType={draft?.zennType}
      onCreatePullRequest={createPostPullRequest}
      onSaveDraft={savePostDraft}
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      tagSuggestions={tagSuggestions}
      uploadImage={uploadImage}
    />
  );
}

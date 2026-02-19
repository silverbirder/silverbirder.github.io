import { Top } from "@repo/admin-feature-top";

import {
  deletePostDraft,
  pullPostDraftsFromGists,
  pushPostDraftsToGists,
} from "@/app/actions";
import { api } from "@/trpc/server";

type Props = {
  searchParams?: Promise<{
    resumeDraftSync?: string;
  }>;
};

export default async function Home({ searchParams }: Props = {}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const resumeDraftSync = resolvedSearchParams?.resumeDraftSync;
  const initialResumeDraftSync =
    resumeDraftSync === "pull" || resumeDraftSync === "push"
      ? resumeDraftSync
      : undefined;
  const drafts = await api.draft.list();
  return (
    <Top
      drafts={drafts}
      initialResumeDraftSync={initialResumeDraftSync}
      onDeleteDraft={deletePostDraft}
      onPullDrafts={pullPostDraftsFromGists}
      onPushDrafts={pushPostDraftsToGists}
    />
  );
}

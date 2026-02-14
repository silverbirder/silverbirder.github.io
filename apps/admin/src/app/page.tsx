import { Top } from "@repo/admin-feature-top";

import { deletePostDraft } from "@/app/actions";
import { api } from "@/trpc/server";

export default async function Home() {
  const drafts = await api.draft.list();
  return <Top drafts={drafts} onDeleteDraft={deletePostDraft} />;
}

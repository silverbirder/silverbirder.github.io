import { PostEditor } from "@repo/admin-feature-post-editor";

import {
  createPostPullRequest,
  resolveLinkTitles,
  resolvePreview,
  uploadImage,
} from "@/app/actions";
import { api } from "@/trpc/server";

export default async function Page() {
  const tagSuggestions = await api.github.listTags();

  return (
    <PostEditor
      enableHatenaSync
      enableZennSync
      onCreatePullRequest={createPostPullRequest}
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      tagSuggestions={tagSuggestions}
      uploadImage={uploadImage}
    />
  );
}

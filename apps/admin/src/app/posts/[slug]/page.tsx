import { PostEditor } from "@repo/admin-feature-post-editor";

import {
  resolveLinkTitles,
  resolvePreview,
  updatePostPullRequest,
  uploadImage,
} from "@/app/actions";
import { api } from "@/trpc/server";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug?.trim() ?? "";
  if (!normalizedSlug) {
    return null;
  }
  const [post, tagSuggestions] = await Promise.all([
    api.github.getPost({ slug: normalizedSlug }),
    api.github.listTags(),
  ]);
  return (
    <PostEditor
      initialBody={post?.body}
      initialPublishedAt={post?.publishedAt}
      initialSummary={post?.summary}
      initialTags={post?.tags}
      initialTitle={post?.title}
      onCreatePullRequest={updatePostPullRequest.bind(null, normalizedSlug)}
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      tagSuggestions={tagSuggestions}
      uploadImage={uploadImage}
    />
  );
}

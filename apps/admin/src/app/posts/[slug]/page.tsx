import { resolveLinkTitles } from "@/app/actions/resolve-link-titles";
import { resolvePreview } from "@/app/actions/resolve-preview";
import { uploadImage } from "@/app/actions/upload-image";

import { PostEditorWithUpdate } from "./post-editor-with-update";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <PostEditorWithUpdate
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      slug={slug}
      uploadImage={uploadImage}
    />
  );
}

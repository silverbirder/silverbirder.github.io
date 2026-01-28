import { resolveLinkTitles } from "@/app/actions/resolve-link-titles";
import { resolvePreview } from "@/app/actions/resolve-preview";
import { uploadImage } from "@/app/actions/upload-image";

import { PostEditorWithPullRequest } from "./post-editor-with-pull-request";

export default function Page() {
  return (
    <PostEditorWithPullRequest
      resolveLinkTitles={resolveLinkTitles}
      resolvePreview={resolvePreview}
      uploadImage={uploadImage}
    />
  );
}

import {
  buildMarkdown,
  parsePublishedAtDate,
} from "@repo/admin-feature-post-editor/libs";
import { getTranslations } from "next-intl/server";

import { api } from "@/trpc/server";

type DraftInput = {
  body: string;
  hatena?: {
    enabled: boolean;
  };
  index: boolean;
  publishedAt: string;
  summary: string;
  tags: string[];
  title: string;
  zenn?: {
    enabled: boolean;
    slug: string;
    topics: string[];
    type: string;
  };
};

type UpdatePullRequestAction =
  | { message: string; type: "alert" }
  | { type: "open"; url: string };

type UpdatePullRequestResult = {
  actions: UpdatePullRequestAction[];
};

export const updatePostPullRequest = async (
  slug: string,
  draft: DraftInput,
): Promise<UpdatePullRequestResult> => {
  "use server";
  const t = await getTranslations("admin.postEditor");
  const actions: UpdatePullRequestAction[] = [];
  const date = parsePublishedAtDate(draft.publishedAt);
  const content = buildMarkdown(draft, date);
  const pullRequestTitle = draft.title.length > 0 ? draft.title : undefined;

  try {
    const result = await api.github.updatePullRequest({
      content,
      fileName: slug,
      pullRequestTitle,
    });

    if (result.url) {
      actions.push({ type: "open", url: result.url });
    } else {
      actions.push({
        message: t("createPullRequestError"),
        type: "alert",
      });
    }
  } catch {
    actions.push({
      message: t("createPullRequestError"),
      type: "alert",
    });
  }

  return { actions };
};

import {
  buildMarkdown,
  buildZennMarkdown,
  getUniqueDailyFileName,
  parsePublishedAtDate,
} from "@repo/admin-feature-post-editor/libs";
import { getTranslations } from "next-intl/server";

import { api } from "@/trpc/server";

type CreatePullRequestAction =
  | { message: string; type: "alert" }
  | { type: "open"; url: string };

type CreatePullRequestResult = {
  actions: CreatePullRequestAction[];
};

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

export const createPostPullRequest = async (
  draft: DraftInput,
): Promise<CreatePullRequestResult> => {
  "use server";
  const t = await getTranslations("admin.postEditor");
  const actions: CreatePullRequestAction[] = [];
  const date = parsePublishedAtDate(draft.publishedAt);
  const existingPosts = await api.github.list();
  const fileName = getUniqueDailyFileName(existingPosts ?? [], date);
  const content = buildMarkdown(draft, date);
  const pullRequestTitle = draft.title.length > 0 ? draft.title : undefined;
  const shouldSyncZenn = draft.zenn?.enabled === true;
  const shouldSyncHatena = draft.hatena?.enabled === true;

  try {
    const result = await api.github.createPullRequest({
      content,
      fileName,
      pullRequestTitle,
    });

    if (shouldSyncZenn && draft.zenn) {
      try {
        const zennContent = buildZennMarkdown({
          body: draft.body,
          title: draft.title,
          topics: draft.zenn.topics,
          type: draft.zenn.type,
        });
        const zennResult = await api.zenn.createPullRequest({
          content: zennContent,
          fileName: draft.zenn.slug,
          pullRequestTitle,
        });
        if (zennResult.url) {
          actions.push({ type: "open", url: zennResult.url });
        } else {
          actions.push({
            message: t("createZennPullRequestError"),
            type: "alert",
          });
        }
      } catch {
        actions.push({
          message: t("createZennPullRequestError"),
          type: "alert",
        });
      }
    }

    if (shouldSyncHatena && draft.hatena) {
      try {
        const hatenaResult = await api.hatena.createDraft({
          body: draft.body,
          title: draft.title,
        });
        const hatenaUrl = hatenaResult.previewUrl ?? hatenaResult.editUrl;
        if (hatenaUrl) {
          actions.push({ type: "open", url: hatenaUrl });
        } else {
          actions.push({
            message: t("createHatenaPullRequestError"),
            type: "alert",
          });
        }
      } catch {
        actions.push({
          message: t("createHatenaPullRequestError"),
          type: "alert",
        });
      }
    }

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

import { getTranslations } from "next-intl/server";

import { auth } from "@/server/better-auth";
import { api } from "@/trpc/server";

type PushPostDraftsToGistsAction =
  | { message: string; type: "alert" }
  | { type: "redirect"; url: string };

type PushPostDraftsToGistsInput = {
  drafts: Array<{
    body: string;
    hatenaEnabled: boolean;
    id: string;
    publishedAt: string;
    summary: string;
    tags: string[];
    title: string;
    updatedAt: string;
    zennEnabled: boolean;
    zennType: string;
  }>;
};

type PushPostDraftsToGistsResult = {
  actions: PushPostDraftsToGistsAction[];
};

const getAuthorizationErrorCode = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return null;
  }

  const withCode = error as {
    code?: unknown;
    data?: {
      code?: unknown;
    };
  };
  const code = withCode.code;
  const dataCode = withCode.data?.code;

  if (code === "UNAUTHORIZED" || dataCode === "UNAUTHORIZED") {
    return "UNAUTHORIZED";
  }
  if (code === "FORBIDDEN" || dataCode === "FORBIDDEN") {
    return "FORBIDDEN";
  }
  return null;
};

export const pushPostDraftsToGists = async ({
  drafts,
}: PushPostDraftsToGistsInput): Promise<PushPostDraftsToGistsResult> => {
  "use server";

  const t = await getTranslations("admin.home");
  const actions: PushPostDraftsToGistsAction[] = [];

  try {
    await api.github.pushDraftsToGists({ drafts });
    actions.push({
      message: t("draftSyncPushSuccess"),
      type: "alert",
    });
    return { actions };
  } catch (error) {
    const authorizationErrorCode = getAuthorizationErrorCode(error);
    if (authorizationErrorCode === "UNAUTHORIZED") {
      const signInResult = await auth.api.signInSocial({
        body: {
          callbackURL: "/?resumeDraftSync=push",
          provider: "github",
        },
      });
      actions.push({
        type: "redirect",
        url: signInResult.url ?? "/sign-in",
      });
      return { actions };
    }
    if (authorizationErrorCode === "FORBIDDEN") {
      actions.push({
        message: t("draftSyncForbidden"),
        type: "alert",
      });
      actions.push({
        type: "redirect",
        url: "/sign-in",
      });
      return { actions };
    }
    actions.push({
      message: t("draftSyncPushError"),
      type: "alert",
    });
    return { actions };
  }
};

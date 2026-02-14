import { getTranslations } from "next-intl/server";

import { api } from "@/trpc/server";

type SavePostDraftInput = {
  body: string;
  hatenaEnabled: boolean;
  id?: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  title: string;
  zennEnabled: boolean;
  zennType: string;
};

type SavePostDraftResult = {
  actions: Array<{ message: string; type: "alert" }>;
  id?: string;
};

export const savePostDraft = async (
  draft: SavePostDraftInput,
): Promise<SavePostDraftResult> => {
  "use server";

  const t = await getTranslations("admin.postEditor");

  try {
    const result = await api.draft.save(draft);

    return {
      actions: [{ message: t("saveDraftSuccess"), type: "alert" }],
      id: result.id,
    };
  } catch {
    return {
      actions: [{ message: t("saveDraftError"), type: "alert" }],
    };
  }
};

import { revalidatePath } from "next/cache";

import { api } from "@/trpc/server";

export const deletePostDraft = async (formData: FormData): Promise<void> => {
  "use server";

  const rawId = formData.get("draftId");
  const draftId = typeof rawId === "string" ? rawId : "";
  if (!draftId) {
    return;
  }

  await api.draft.delete({ id: draftId });
  revalidatePath("/");
};

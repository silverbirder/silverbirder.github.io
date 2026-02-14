import { describe, expect, it, vi } from "vitest";

const loadAction = async () => {
  vi.resetModules();

  const getTranslations = vi.fn().mockResolvedValue((key: string) => key);
  const save = vi.fn();

  vi.doMock("next-intl/server", () => ({
    getTranslations,
  }));

  vi.doMock("@/trpc/server", () => ({
    api: {
      draft: {
        save,
      },
    },
  }));

  const mod = await import("./save-post-draft");

  return {
    getTranslations,
    save,
    savePostDraft: mod.savePostDraft,
  };
};

describe("savePostDraft", () => {
  it("saves draft and returns success action", async () => {
    const { getTranslations, save, savePostDraft } = await loadAction();
    save.mockResolvedValue({ id: "draft-1" });

    const result = await savePostDraft({
      body: "body",
      hatenaEnabled: false,
      publishedAt: "2026-02-14",
      summary: "summary",
      tags: [],
      title: "title",
      zennEnabled: false,
      zennType: "tech",
    });

    expect(getTranslations).toHaveBeenCalledWith("admin.postEditor");
    expect(save).toHaveBeenCalledOnce();
    expect(result.id).toBe("draft-1");
    expect(result.actions).toEqual([
      { message: "saveDraftSuccess", type: "alert" },
    ]);
  });

  it("returns failure action when save throws", async () => {
    const { save, savePostDraft } = await loadAction();
    save.mockRejectedValue(new Error("failed"));

    const result = await savePostDraft({
      body: "body",
      hatenaEnabled: false,
      publishedAt: "2026-02-14",
      summary: "summary",
      tags: [],
      title: "title",
      zennEnabled: false,
      zennType: "tech",
    });

    expect(result.actions).toEqual([
      { message: "saveDraftError", type: "alert" },
    ]);
  });
});

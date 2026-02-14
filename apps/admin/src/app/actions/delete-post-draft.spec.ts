import { describe, expect, it, vi } from "vitest";

const loadAction = async () => {
  vi.resetModules();

  const deleteMock = vi.fn();
  const revalidatePath = vi.fn();

  vi.doMock("next/cache", () => ({
    revalidatePath,
  }));

  vi.doMock("@/trpc/server", () => ({
    api: {
      draft: {
        delete: deleteMock,
      },
    },
  }));

  const mod = await import("./delete-post-draft");

  return {
    deleteMock,
    deletePostDraft: mod.deletePostDraft,
    revalidatePath,
  };
};

describe("deletePostDraft", () => {
  it("deletes draft and revalidates top page", async () => {
    const { deleteMock, deletePostDraft, revalidatePath } = await loadAction();

    const formData = new FormData();
    formData.set("draftId", "draft-1");

    await deletePostDraft(formData);

    expect(deleteMock).toHaveBeenCalledWith({ id: "draft-1" });
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("does nothing when draft id is missing", async () => {
    const { deleteMock, deletePostDraft, revalidatePath } = await loadAction();

    await deletePostDraft(new FormData());

    expect(deleteMock).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});

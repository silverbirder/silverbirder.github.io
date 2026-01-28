import { describe, expect, it, vi } from "vitest";

const loadAction = async () => {
  vi.resetModules();

  const preview = vi.fn().mockResolvedValue({
    compiledSource: "<p>Preview</p>",
    frontmatter: {},
    scope: {},
  });

  vi.doMock("@/trpc/server", () => ({
    api: {
      mdx: {
        preview,
      },
    },
  }));

  const mod = await import("./resolve-preview");

  return {
    preview,
    resolvePreview: mod.resolvePreview,
  };
};

describe("resolvePreview", () => {
  it("delegates to the mdx preview procedure", async () => {
    const { preview, resolvePreview } = await loadAction();

    const result = await resolvePreview("# Draft");

    expect(preview).toHaveBeenCalledWith({ source: "# Draft" });
    expect(result).toEqual({
      compiledSource: "<p>Preview</p>",
      frontmatter: {},
      scope: {},
    });
  });
});

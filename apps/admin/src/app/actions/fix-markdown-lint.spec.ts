import { afterEach, describe, expect, it, vi } from "vitest";

const lintSyncMock = vi.fn();
const applyFixesMock = vi.fn();

vi.mock("markdownlint/sync", () => ({
  lint: lintSyncMock,
}));

vi.mock("markdownlint", () => ({
  applyFixes: applyFixesMock,
}));

const loadAction = async () => {
  vi.resetModules();
  const mod = await import("./fix-markdown-lint");
  return {
    fixMarkdownLint: mod.fixMarkdownLint,
  };
};

describe("fixMarkdownLint", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns fixed markdown from markdownlint", async () => {
    const errors = [{ lineNumber: 1, ruleNames: ["MD001"] }];
    lintSyncMock.mockReturnValue({ content: errors });
    applyFixesMock.mockReturnValue("fixed body");

    const { fixMarkdownLint } = await loadAction();

    const result = await fixMarkdownLint("raw body");

    expect(result).toBe("fixed body");
    expect(lintSyncMock).toHaveBeenCalledWith({
      config: {
        default: true,
        MD013: false,
        MD033: {
          allowed_elements: ["iframe"],
        },
        MD034: false,
        MD041: false,
      },
      strings: {
        content: "raw body",
      },
    });
    expect(applyFixesMock).toHaveBeenCalledWith("raw body", errors);
  });
});

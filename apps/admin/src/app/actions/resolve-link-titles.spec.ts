import { afterEach, describe, expect, it, vi } from "vitest";

const mockFetch = vi.fn();

const loadAction = async () => {
  vi.resetModules();
  const mod = await import("./resolve-link-titles");
  return {
    resolveLinkTitles: mod.resolveLinkTitles,
  };
};

describe("resolveLinkTitles", () => {
  afterEach(() => {
    mockFetch.mockReset();
    vi.unstubAllGlobals();
  });

  it("returns markdown with updated link text", async () => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        '<!doctype html><html><head><meta property="og:title" content="Different OG Title" /><title>Example Page</title></head><body></body></html>',
    });

    const { resolveLinkTitles } = await loadAction();

    const result = await resolveLinkTitles("See [link](https://example.com).");

    expect(mockFetch).toHaveBeenCalledWith("https://example.com", {
      cache: "no-store",
      headers: {
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "user-agent": "AdminLinkResolver/1.0",
      },
      redirect: "follow",
      signal: expect.any(AbortSignal),
    });
    expect(result).toContain("Example Page - example.com");
  });
});

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

  it("keeps hard-break representation without backslash", async () => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        "<!doctype html><html><head><title>Example Page</title></head><body></body></html>",
    });

    const { resolveLinkTitles } = await loadAction();
    const source = "Line 1  \nSee [link](https://example.com).";

    const result = await resolveLinkTitles(source);

    expect(result).toContain("Example Page - example.com");
    expect(result).toContain("Line 1  \n");
    expect(result).not.toContain("\\\n");
  });

  it("keeps list marker style as hyphen", async () => {
    vi.stubGlobal("fetch", mockFetch);
    mockFetch.mockResolvedValue({
      ok: true,
      text: async () =>
        "<!doctype html><html><head><title>Example Page</title></head><body></body></html>",
    });

    const { resolveLinkTitles } = await loadAction();
    const source = "- [link](https://example.com)\n- second";

    const result = await resolveLinkTitles(source);

    expect(result).toContain(
      "- [Example Page - example.com](https://example.com)",
    );
    expect(result).toContain("- second");
    expect(result).not.toContain(
      "* [Example Page - example.com](https://example.com)",
    );
  });
});

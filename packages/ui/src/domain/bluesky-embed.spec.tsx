import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { BlueskyEmbed } from "./bluesky-embed";

describe("BlueskyEmbed", () => {
  it("renders Bluesky embed iframe from a permalink", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ did: "did:plc:abc123" }),
        ok: true,
      }),
    );

    const { container } = await renderWithProvider(
      <BlueskyEmbed permalink="https://bsky.app/profile/silverbirder.bsky.social/post/3mgugc6ec222b" />,
    );

    await vi.waitFor(() => {
      const iframe = container.querySelector("iframe");
      expect(iframe).not.toBeNull();
      expect(iframe?.getAttribute("src")).toContain(
        "https://embed.bsky.app/embed/did:plc:abc123/app.bsky.feed.post/3mgugc6ec222b",
      );
      expect(iframe?.getAttribute("src")).toContain("colorMode=system");
    });
  });

  it("updates iframe height from embed.bsky.app postMessage events", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ did: "did:plc:abc123" }),
        ok: true,
      }),
    );

    const { container } = await renderWithProvider(
      <BlueskyEmbed permalink="https://bsky.app/profile/silverbirder.bsky.social/post/3mgugc6ec222b" />,
    );

    let iframe: HTMLIFrameElement | null = null;
    let embedId = "";

    await vi.waitFor(() => {
      iframe = container.querySelector("iframe");
      embedId = iframe?.getAttribute("data-bluesky-id") ?? "";
      expect(embedId).not.toBe("");
    });

    window.dispatchEvent(
      new MessageEvent("message", {
        data: { height: 480, id: embedId },
        origin: "https://embed.bsky.app",
      }),
    );

    await vi.waitFor(() => {
      expect((iframe as HTMLIFrameElement | null)?.style.height).toBe("480px");
    });
  });

  it("renders a fallback link when permalink is invalid", async () => {
    const { container } = await renderWithProvider(
      <BlueskyEmbed permalink="https://example.com/post/1" />,
    );

    const anchor = container.querySelector(
      'a[href="https://example.com/post/1"]',
    );
    expect(anchor?.textContent).toContain("Bluesky");
  });
});

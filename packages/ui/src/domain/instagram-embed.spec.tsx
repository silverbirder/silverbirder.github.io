import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { InstagramEmbed } from "./instagram-embed";

describe("InstagramEmbed", () => {
  it("renders blockquote with Instagram embed attributes", async () => {
    const process = vi.fn();
    window.instgrm = {
      Embeds: {
        process,
      },
    };

    const { container } = await renderWithProvider(
      <InstagramEmbed permalink="https://www.instagram.com/p/ABC123/" />,
    );

    const wrapper = container.querySelector('[data-embed="instagram"]');
    const blockquote = container.querySelector("blockquote.instagram-media");
    const anchor = container.querySelector("blockquote a");

    expect(wrapper).not.toBeNull();
    expect(blockquote?.getAttribute("data-instgrm-permalink")).toBe(
      "https://www.instagram.com/p/ABC123/",
    );
    expect(blockquote?.getAttribute("data-instgrm-captioned")).toBe("true");
    expect(anchor?.getAttribute("href")).toBe(
      "https://www.instagram.com/p/ABC123/",
    );
    expect(process).toHaveBeenCalled();
  });

  it("loads the Instagram embed script when SDK is unavailable", async () => {
    delete window.instgrm;

    await renderWithProvider(
      <InstagramEmbed permalink="https://www.instagram.com/reel/ABC123/" />,
    );

    const script = document.querySelector(
      'script[src="https://www.instagram.com/embed.js"]',
    );

    expect(script).not.toBeNull();
  });
});

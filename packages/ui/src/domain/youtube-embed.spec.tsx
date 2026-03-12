import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { YouTubeEmbed } from "./youtube-embed";

describe("YouTubeEmbed", () => {
  it("renders iframe with the given source URL", async () => {
    const { container } = await renderWithProvider(
      <YouTubeEmbed src="https://www.youtube-nocookie.com/embed/abc123" />,
    );

    const wrapper = container.querySelector('[data-embed="youtube"]');
    const iframe = container.querySelector("iframe");

    expect(wrapper).not.toBeNull();
    expect(iframe?.getAttribute("src")).toBe(
      "https://www.youtube-nocookie.com/embed/abc123",
    );
    expect(iframe?.getAttribute("loading")).toBe("lazy");
    expect(iframe?.getAttribute("allowfullscreen")).toBe("");
  });

  it("uses default title when title is not provided", async () => {
    const { container } = await renderWithProvider(
      <YouTubeEmbed src="https://www.youtube-nocookie.com/embed/abc123" />,
    );

    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("title")).toBe("YouTube Embed");
  });
});

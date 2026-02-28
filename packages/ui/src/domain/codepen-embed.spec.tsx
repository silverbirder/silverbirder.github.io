import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { CodepenEmbed } from "./codepen-embed";

describe("CodepenEmbed", () => {
  it("renders iframe with the given source URL", async () => {
    const { container } = await renderWithProvider(
      <CodepenEmbed src="https://codepen.io/silverbirder/embed/gbYwrOa" />,
    );

    const wrapper = container.querySelector('[data-embed="codepen"]');
    const iframe = container.querySelector("iframe");

    expect(wrapper).not.toBeNull();
    expect(iframe?.getAttribute("src")).toBe(
      "https://codepen.io/silverbirder/embed/gbYwrOa",
    );
    expect(iframe?.getAttribute("loading")).toBe("lazy");
  });

  it("uses default title when title is not provided", async () => {
    const { container } = await renderWithProvider(
      <CodepenEmbed src="https://codepen.io/silverbirder/embed/gbYwrOa" />,
    );

    const iframe = container.querySelector("iframe");
    expect(iframe?.getAttribute("title")).toBe("CodePen Embed");
  });
});

import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { OfuseButton } from "./ofuse-button";

const url = "https://ofuse.me/o?uid=158382";

vi.mock("next/navigation", () => ({
  usePathname: () => "/blog/contents/test",
}));

describe("OfuseButton", () => {
  it("renders ofuse widget anchor inside a two-line-height wrapper", async () => {
    const { container } = await renderWithProvider(
      <OfuseButton id="158382" label="OFUSEで応援を送る" url={url} />,
    );

    const wrapper = container.querySelector(
      '[data-testid="ofuse-widget-wrap"]',
    );
    const anchor = container.querySelector("a[data-ofuse-widget-button]");

    expect(wrapper).not.toBeNull();
    expect(anchor?.getAttribute("href")).toBe(url);
    expect(anchor?.getAttribute("data-ofuse-id")).toBe("158382");
    expect(anchor?.getAttribute("data-ofuse-style")).toBe("rectangle");
    expect(anchor?.textContent).toBe("OFUSEで応援を送る");
  });

  it("reloads the ofuse widget script on route mount", async () => {
    const staleScript = document.createElement("script");
    staleScript.src = "https://ofuse.me/assets/platform/widget.js";
    document.body.appendChild(staleScript);

    await renderWithProvider(
      <OfuseButton id="158382" label="OFUSEで応援を送る" url={url} />,
    );

    const scripts = document.querySelectorAll(
      'script[src="https://ofuse.me/assets/platform/widget.js"]',
    );

    expect(usePathname()).toBe("/blog/contents/test");
    expect(scripts).toHaveLength(1);
    expect(scripts[0]).not.toBe(staleScript);
  });
});

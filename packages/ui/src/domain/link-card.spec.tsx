import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { LinkCard } from "./link-card";

describe("LinkCard", () => {
  it("renders title, description, favicon, and thumbnail", async () => {
    const { container } = await renderWithProvider(
      <LinkCard
        description="Description"
        faviconSrc="/favicon.png"
        siteName="Example"
        thumbnailSrc="/thumbnail.png"
        title="Example title"
        url="https://example.com"
      />,
    );

    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("https://example.com");
    expect(link?.textContent).toContain("Example title");
    expect(link?.textContent).toContain("Description");
    expect(link?.textContent).toContain("Example");

    const images = Array.from(container.querySelectorAll("img"));
    expect(images.map((image) => image.getAttribute("src"))).toEqual([
      "/favicon.png",
      "/thumbnail.png",
    ]);
  });

  it("does not render a favicon image when faviconSrc is absent", async () => {
    const { container } = await renderWithProvider(
      <LinkCard
        description="Description"
        siteName="Example"
        thumbnailSrc="/thumbnail.png"
        title="Example title"
        url="https://example.com"
      />,
    );

    const images = Array.from(container.querySelectorAll("img"));
    expect(images.map((image) => image.getAttribute("src"))).toEqual([
      "/thumbnail.png",
    ]);
  });

  it("does not render image elements when image props are non-string values", async () => {
    const { container } = await renderWithProvider(
      <LinkCard
        description="Description"
        faviconSrc={true as never}
        siteName="Example"
        thumbnailSrc={true as never}
        title="Example title"
        url="https://example.com"
      />,
    );

    expect(container.querySelectorAll("img")).toHaveLength(0);
  });
});

import type {
  ComponentPropsWithoutRef,
  ComponentType,
  CSSProperties,
} from "react";

import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "../test-util";
import { mdxComponents } from "./mdx-components";
import { NotebookImage } from "./notebook-image";
import * as stories from "./notebook-image.stories";

const Stories = composeStories(stories);

const findDialog = async () => {
  for (let count = 0; count < 10; count += 1) {
    const dialog = document.body.querySelector('[role="dialog"]');
    if (dialog) {
      return dialog;
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  return null;
};

describe("NotebookImage", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders an image with alt text", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage alt="Notebook sample" src="/test.png" />,
    );

    const image = container.querySelector("img");
    expect(image?.getAttribute("alt")).toBe("Notebook sample");

    const captionText = container.querySelector("figcaption span");
    expect(captionText?.textContent).toBe("Notebook sample");
  });

  it("opens enlarged image dialog when image is clicked", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage alt="Notebook sample" src="/test.png" />,
    );

    const trigger = container.querySelector<HTMLButtonElement>("button");
    trigger?.click();

    const dialog = await findDialog();
    expect(dialog).not.toBeNull();

    const enlargedImage = dialog?.querySelector("img");
    expect(enlargedImage?.getAttribute("src")).toBe("/test.png");
    expect(enlargedImage?.getAttribute("alt")).toBe("Notebook sample");
  });

  it("closes enlarged image dialog when close button is clicked", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage alt="Notebook sample" src="/test.png" />,
    );

    const trigger = container.querySelector<HTMLButtonElement>("button");
    trigger?.click();

    const dialog = await findDialog();
    const closeButton = dialog?.querySelector<HTMLButtonElement>(
      'button[aria-label="拡大画像を閉じる"]',
    );
    closeButton?.click();
    await Promise.resolve();

    const closedDialog = document.body.querySelector('[role="dialog"]');
    expect(closedDialog?.getAttribute("data-state")).toBe("closed");
  });

  it("sets max height as a multiple of the notebook line height", async () => {
    const { container } = await renderWithProvider(
      <div style={{ "--notebook-line-height": "2rem" } as CSSProperties}>
        <NotebookImage alt="Notebook sample" src="/test.png" />
      </div>,
    );

    const figure = container.querySelector("figure");
    const image = container.querySelector("img");

    const lineHeight = Number.parseFloat(
      getComputedStyle(figure as HTMLElement).lineHeight,
    );
    const maxHeight = Number.parseFloat(
      getComputedStyle(image as HTMLImageElement).maxHeight,
    );

    expect(Number.isFinite(lineHeight)).toBe(true);
    expect(maxHeight).toBeCloseTo(lineHeight * 20, 3);
  });

  it("renders an open-in-new-tab link when linkHref is provided", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage
        alt="Notebook sample"
        linkHref="https://example.com"
        src="/test.png"
      />,
    );

    const imageLink = container.querySelector("figure > a");
    expect(imageLink).toBeNull();

    const newTabLink = container.querySelector("figcaption a");
    expect(newTabLink?.getAttribute("href")).toBe("https://example.com");
    expect(newTabLink?.getAttribute("target")).toBe("_blank");
    expect(newTabLink?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(newTabLink?.getAttribute("aria-label")).toBe("別タブで開く");
    expect(newTabLink?.querySelector("svg")).not.toBeNull();
  });

  it("does not render a caption when alt is empty", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage alt="" src="/test.png" />,
    );

    const caption = container.querySelector("figcaption");
    expect(caption).toBeNull();
  });

  it("renders a caption when linkHref is provided even if alt is empty", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage alt="" linkHref="https://example.com" src="/test.png" />,
    );

    const caption = container.querySelector("figcaption");
    expect(caption).not.toBeNull();

    const newTabLink = container.querySelector("figcaption a");
    expect(newTabLink?.getAttribute("href")).toBe("https://example.com");
    expect(newTabLink?.getAttribute("target")).toBe("_blank");
  });

  it("applies wrapping styles to long caption text", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage
        alt="VeryLongCaptionWithoutSpacesVeryLongCaptionWithoutSpacesVeryLongCaptionWithoutSpaces"
        src="/test.png"
      />,
    );

    const caption = container.querySelector("figcaption");
    const captionText = container.querySelector("figcaption span");

    expect(caption).not.toBeNull();
    expect(captionText).not.toBeNull();
    expect(getComputedStyle(caption as HTMLElement).maxWidth).toBe("100%");
    expect(getComputedStyle(captionText as HTMLElement).overflowWrap).toBe(
      "anywhere",
    );
    expect(getComputedStyle(captionText as HTMLElement).wordBreak).toBe(
      "break-word",
    );
    expect(getComputedStyle(captionText as HTMLElement).whiteSpace).toBe(
      "normal",
    );
  });

  it("passes href from mdx anchor wrapper to NotebookImage", async () => {
    const A = mdxComponents.a as unknown as ComponentType<
      ComponentPropsWithoutRef<"a">
    >;

    const { container } = await renderWithProvider(
      <A href="https://example.com">
        <NotebookImage alt="Notebook sample" src="/test.png" />
      </A>,
    );

    const links = Array.from(container.querySelectorAll("a"));
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute("href")).toBe("https://example.com");
    expect(links[0]?.getAttribute("target")).toBe("_blank");
  });

  it("keeps cloudinary image metadata in the src", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage
        alt="Notebook sample"
        src="https://res.cloudinary.com/silverbirder/image/upload/v1770553428/silver-birder.github.io/blog/s0ezzpq8qcuoqah51nqs.jpg?ar=1280:1017"
      />,
    );

    const image = container.querySelector("img");

    expect(image?.getAttribute("src")).toBe(
      "https://res.cloudinary.com/silverbirder/image/upload/v1770553428/silver-birder.github.io/blog/s0ezzpq8qcuoqah51nqs.jpg?ar=1280:1017",
    );
  });

  it("does not add srcSet for non-cloudinary image in the test mock", async () => {
    const { container } = await renderWithProvider(
      <NotebookImage alt="Notebook sample" src="/test.png" />,
    );

    const image = container.querySelector("img");

    expect(image?.getAttribute("srcset")).toBeNull();
  });
});

import { composeStories } from "@storybook/nextjs-vite";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { NotebookLike } from "./notebook-like";
import * as stories from "./notebook-like.stories";

const Stories = composeStories(stories);

describe("NotebookLike", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders a button and count label", async () => {
    const { container } = await renderWithProvider(
      <NotebookLike
        disableAutoLoad
        initialCount={3}
        name="sample-post"
        namespace="silverbirder-github-io"
      />,
    );

    const button = container.querySelector(
      'button[aria-label="この記事にいいねする"]',
    );
    const bodyText = container.textContent ?? "";

    expect(button).not.toBeNull();
    expect(bodyText).toContain("3");
  });

  it("shows a hover balloon on like button hover", async () => {
    const { container } = await renderWithProvider(
      <NotebookLike
        disableAutoLoad
        initialCount={3}
        name="sample-post"
        namespace="silverbirder-github-io"
      />,
    );

    const button = container.querySelector(
      'button[aria-label="この記事にいいねする"]',
    ) as HTMLButtonElement | null;
    button?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
    button?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    await vi.waitFor(() => {
      expect(
        container.querySelector('[data-testid="notebook-like-balloon"]')
          ?.textContent ?? "",
      ).toBe("\\ ｲｲﾈ /");
    });
  });

  it("keeps click balloon while hovered and hides it after hover out", async () => {
    const { container } = await renderWithProvider(
      <NotebookLike
        disableAutoLoad
        initialCount={3}
        name="sample-post"
        namespace="silverbirder-github-io"
      />,
    );

    const button = container.querySelector(
      'button[aria-label="この記事にいいねする"]',
    ) as HTMLButtonElement | null;
    button?.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
    button?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await vi.waitFor(() => {
      expect(
        container.querySelector('[data-testid="notebook-like-balloon"]')
          ?.textContent ?? "",
      ).toBe("\\ ｻﾝｷｭｰ! /");
    });

    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    expect(
      container.querySelector('[data-testid="notebook-like-balloon"]')
        ?.textContent ?? "",
    ).toBe("\\ ｻﾝｷｭｰ! /");

    button?.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
    button?.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    await vi.waitFor(() => {
      expect(
        container.querySelector('[data-testid="notebook-like-balloon"]')
          ?.textContent ?? "",
      ).toBe("");
    });
  });
});

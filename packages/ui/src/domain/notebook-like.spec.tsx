import { composeStories } from "@storybook/nextjs-vite";
import { afterEach, describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { NotebookLike } from "./notebook-like";
import * as stories from "./notebook-like.stories";

const Stories = composeStories(stories);
const originalMatchMedia = window.matchMedia;
const createMatchMediaMock = (hoverMatches: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: query.includes("(hover: hover)") ? hoverMatches : false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }));
const getBalloonText = (container: HTMLElement) =>
  container.querySelector('[data-testid="notebook-like-balloon"]')
    ?.textContent ?? "";
const getLikeButton = (container: HTMLElement) => {
  const button = container.querySelector(
    'button[aria-label="この記事にいいねする"]',
  );
  expect(button).not.toBeNull();
  return button as HTMLButtonElement;
};
const triggerLikeClick = (button: HTMLButtonElement) => {
  button.dispatchEvent(
    new MouseEvent("click", { bubbles: true, cancelable: true }),
  );
};
const waitForButtonToBeEnabled = async (button: HTMLButtonElement) => {
  await vi.waitFor(() => {
    expect(button.disabled).toBe(false);
  });
};
const waitForButtonPressedState = async (
  button: HTMLButtonElement,
  pressed: boolean,
) => {
  await vi.waitFor(() => {
    expect(button.getAttribute("aria-pressed")).toBe(String(pressed));
  });
};
const waitForBalloonText = async (
  container: HTMLElement,
  expectedText: string,
) => {
  await vi.waitFor(() => {
    expect(getBalloonText(container)).toBe(expectedText);
  });
};

describe("NotebookLike", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia,
      writable: true,
    });
  });

  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ count: 3, liked: false }), { status: 200 }),
    );
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders a button and count label", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ count: 3, liked: false }), { status: 200 }),
    );
    const { container } = await renderWithProvider(
      <NotebookLike name="sample-post" namespace="silverbirder-github-io" />,
    );

    const button = container.querySelector(
      'button[aria-label="この記事にいいねする"]',
    );
    expect(button).not.toBeNull();
    await vi.waitFor(() => {
      expect(container.textContent ?? "").toContain("3");
    });
  });

  it("shows a hover balloon on like button hover", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ count: 3, liked: false }), { status: 200 }),
    );
    const { container } = await renderWithProvider(
      <NotebookLike name="sample-post" namespace="silverbirder-github-io" />,
    );

    const button = getLikeButton(container);
    await waitForButtonToBeEnabled(button);
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
    button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    button.focus();
    await vi.waitFor(() => {
      expect(getBalloonText(container)).toBe("\\ ｲｲﾈ /");
    });
  });

  it("keeps click balloon after hover out and hides it after timeout", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 3, liked: false }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 4, liked: true }), {
          status: 200,
        }),
      );
    const { container } = await renderWithProvider(
      <NotebookLike name="sample-post" namespace="silverbirder-github-io" />,
    );

    const button = getLikeButton(container);
    await waitForButtonToBeEnabled(button);
    button.dispatchEvent(new MouseEvent("mouseenter", { bubbles: false }));
    button.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    button.focus();
    triggerLikeClick(button);
    await waitForBalloonText(container, "\\ ｻﾝｷｭｰ! /");

    expect(getBalloonText(container)).toBe("\\ ｻﾝｷｭｰ! /");

    button.dispatchEvent(new MouseEvent("mouseleave", { bubbles: false }));
    button.dispatchEvent(new MouseEvent("mouseout", { bubbles: true }));
    button.blur();

    await vi.advanceTimersByTimeAsync(20);

    expect(getBalloonText(container)).toBe("\\ ｻﾝｷｭｰ! /");

    await vi.advanceTimersByTimeAsync(4000);
    await waitForBalloonText(container, "");
  });

  it("shows apology balloon when clicking an already liked button", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 3, liked: true }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 2, liked: false }), {
          status: 200,
        }),
      );
    const { container } = await renderWithProvider(
      <NotebookLike name="sample-post" namespace="silverbirder-github-io" />,
    );

    const button = getLikeButton(container);
    await waitForButtonToBeEnabled(button);
    await waitForButtonPressedState(button, true);
    triggerLikeClick(button);
    await waitForBalloonText(container, "\\ ｽﾏﾝﾅ! /");

    expect(getBalloonText(container)).toBe("\\ ｽﾏﾝﾅ! /");
  });

  it("does not keep hover balloon on non-hover devices after click timeout", async () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: createMatchMediaMock(false),
      writable: true,
    });
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 3, liked: false }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ count: 4, liked: true }), {
          status: 200,
        }),
      );

    const { container } = await renderWithProvider(
      <NotebookLike name="sample-post" namespace="silverbirder-github-io" />,
    );

    const button = getLikeButton(container);
    await waitForButtonToBeEnabled(button);
    button.focus();
    triggerLikeClick(button);
    await waitForBalloonText(container, "\\ ｻﾝｷｭｰ! /");

    expect(getBalloonText(container)).toBe("\\ ｻﾝｷｭｰ! /");

    await vi.advanceTimersByTimeAsync(4000);
    await waitForBalloonText(container, "");
  });

  it("does not crash when localStorage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => {
      throw new Error("storage unavailable");
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ count: 3, liked: false }), { status: 200 }),
    );

    const { container } = await renderWithProvider(
      <NotebookLike name="sample-post" namespace="silverbirder-github-io" />,
    );

    expect(getLikeButton(container)).not.toBeNull();
  });
});

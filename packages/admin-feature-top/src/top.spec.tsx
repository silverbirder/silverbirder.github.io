import { composeStories } from "@storybook/nextjs-vite";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "./test-util";
import { Top } from "./top";
import * as stories from "./top.stories";

const Stories = composeStories(stories);
const POST_DRAFTS_STORAGE_KEY = "silverbirder-admin-post-drafts";

describe("Top", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders labels from messages", async () => {
    await renderWithProvider(
      <Top
        drafts={[
          {
            id: "draft-1",
            publishedAt: "2026-02-14",
            title: "下書きタイトル",
            updatedAt: "2026-02-14T12:00:00.000Z",
          },
        ]}
      />,
    );
    const newPostLink = document.querySelector(
      "[data-testid='admin-new-post-link']",
    );
    const draftItem = document.querySelector(
      "[data-testid='admin-draft-item']",
    );

    expect(newPostLink?.textContent ?? "").toContain("新規投稿");
    expect(draftItem?.textContent ?? "").toContain("下書きタイトル");
  });

  it("renders drafts restored from local storage", async () => {
    window.localStorage.setItem(
      POST_DRAFTS_STORAGE_KEY,
      JSON.stringify([
        {
          body: "body",
          hatenaEnabled: false,
          id: "local-draft-1",
          publishedAt: "2026-02-14",
          summary: "summary",
          tags: [],
          title: "ローカル下書き",
          updatedAt: "2026-02-14T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
      ]),
    );

    await renderWithProvider(<Top drafts={[]} />);

    await expect
      .poll(() =>
        (
          document.querySelector("[data-testid='admin-draft-item']")
            ?.textContent ?? ""
        ).includes("ローカル下書き"),
      )
      .toBe(true);
  });

  it("pushes local drafts when push button is clicked", async () => {
    window.localStorage.setItem(
      POST_DRAFTS_STORAGE_KEY,
      JSON.stringify([
        {
          body: "body",
          hatenaEnabled: false,
          id: "local-draft-1",
          publishedAt: "2026-02-14",
          summary: "summary",
          tags: [],
          title: "ローカル下書き",
          updatedAt: "2026-02-14T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
      ]),
    );
    const onPushDrafts = vi.fn().mockResolvedValue({
      actions: [{ message: "push-synced", type: "alert" }],
    });
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    await renderWithProvider(<Top drafts={[]} onPushDrafts={onPushDrafts} />);

    const pushButton = document.querySelector(
      "[data-testid='admin-draft-sync-push']",
    ) as HTMLButtonElement | null;
    pushButton?.click();

    await expect.poll(() => onPushDrafts.mock.calls.length).toBe(1);
    expect(onPushDrafts).toHaveBeenCalledWith({
      drafts: [
        {
          body: "body",
          hatenaEnabled: false,
          id: "local-draft-1",
          publishedAt: "2026-02-14",
          summary: "summary",
          tags: [],
          title: "ローカル下書き",
          updatedAt: "2026-02-14T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
      ],
    });
    expect(alertSpy).toHaveBeenCalledWith("push-synced");
    alertSpy.mockRestore();
  });

  it("replaces local drafts when pulling from gists", async () => {
    window.localStorage.setItem(
      POST_DRAFTS_STORAGE_KEY,
      JSON.stringify([
        {
          body: "old-body",
          hatenaEnabled: false,
          id: "old-draft",
          publishedAt: "2026-02-10",
          summary: "old-summary",
          tags: [],
          title: "古い下書き",
          updatedAt: "2026-02-10T12:00:00.000Z",
          zennEnabled: false,
          zennType: "tech",
        },
      ]),
    );
    const onPullDrafts = vi.fn().mockResolvedValue({
      actions: [
        {
          drafts: [
            {
              body: "new-body",
              hatenaEnabled: false,
              id: "new-draft",
              publishedAt: "2026-02-19",
              summary: "new-summary",
              tags: ["tag"],
              title: "新しい下書き",
              updatedAt: "2026-02-19T12:00:00.000Z",
              zennEnabled: false,
              zennType: "tech",
            },
          ],
          type: "replaceLocalDrafts",
        },
      ],
    });

    await renderWithProvider(<Top drafts={[]} onPullDrafts={onPullDrafts} />);

    const pullButton = document.querySelector(
      "[data-testid='admin-draft-sync-pull']",
    ) as HTMLButtonElement | null;
    pullButton?.click();

    await expect.poll(() => onPullDrafts.mock.calls.length).toBe(1);
    await expect
      .poll(() =>
        (
          document.querySelector("[data-testid='admin-draft-item']")
            ?.textContent ?? ""
        ).includes("新しい下書き"),
      )
      .toBe(true);
  });
});

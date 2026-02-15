import { composeStories } from "@storybook/nextjs-vite";
import { beforeEach, describe, expect, it } from "vitest";

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
});

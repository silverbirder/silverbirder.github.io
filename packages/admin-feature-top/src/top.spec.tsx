import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";

import { renderWithProvider } from "./test-util";
import { Top } from "./top";
import * as stories from "./top.stories";

const Stories = composeStories(stories);

describe("Top", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders labels from messages", async () => {
    await renderWithProvider(
      <Top
        name="Alice"
        onSignOut={async () => {}}
        posts={["2025-01-01-first-post.md"]}
      />,
    );

    const title = document.querySelector("h1");
    const signedInAs = document.querySelector("p");
    const button = document.querySelector("button");
    const newPostLink = document.querySelector(
      "[data-testid='admin-new-post-link']",
    );
    const postsTitle = document.querySelector("h2");
    const postNames = document.querySelectorAll("[data-testid='post-name']");

    expect(title?.textContent ?? "").toContain("管理ホーム");
    expect(signedInAs?.textContent ?? "").toContain("Alice");
    expect(button?.textContent ?? "").toContain("サインアウト");
    expect(newPostLink?.textContent ?? "").toContain("新規投稿");
    expect(postsTitle?.textContent ?? "").toContain("投稿一覧");
    expect(Array.from(postNames).map((post) => post.textContent)).toContain(
      "2025-01-01-first-post.md",
    );
  });
});

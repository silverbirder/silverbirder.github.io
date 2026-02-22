import { composeStories } from "@storybook/nextjs-vite";
import { FaXTwitter } from "react-icons/fa6";
import { describe, expect, it, vi } from "vitest";

import { renderWithProvider } from "../test-util";
import { Notebook } from "./notebook";
import * as stories from "./notebook.stories";

vi.mock("next/navigation", () => {
  return {
    usePathname: () => "/",
  };
});

const Stories = composeStories(stories);

describe("Notebook", () => {
  it.each(Object.entries(Stories))("should render %s", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders title, date, and tags", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        navigation={{}}
        postNumber={1}
        publishedAt="2025-01-02"
        relatedPosts={[]}
        tags={["Chakra", "Design"]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    const heading = container.querySelector("h1");
    const time = container.querySelector("time");

    expect(heading?.textContent ?? "").toBe("Notebook Preview");
    expect(time?.textContent ?? "").toBe("2025. 01. 02");
    expect(container.textContent ?? "").toContain("NO");
    expect(container.textContent ?? "").toContain("Chakra");
    expect(container.textContent ?? "").toContain("Design");
  });

  it("renders share and follow sections when provided", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        follow={{
          heading: "Follow",
          items: [
            {
              active: "#000000",
              bg: "#111111",
              hover: "#222222",
              href: "https://example.com",
              icon: <FaXTwitter />,
              label: "Xをフォロー",
            },
          ],
        }}
        navigation={{}}
        relatedPosts={[]}
        share={{
          heading: "Share",
          labels: {
            bluesky: "Blueskyでシェア",
            copy: "リンクをコピー",
            copyCopied: "コピーしました",
            facebook: "Facebookでシェア",
            hatena: "はてなでシェア",
            line: "LINEでシェア",
            threads: "Threadsでシェア",
            web: "デバイスで共有",
            x: "Xでシェア",
          },
          text: "Share text",
          url: "https://example.com",
        }}
        subscription={{
          heading: "購読する",
          label: "RSSをフォロー",
          url: "https://example.com/rss.xml",
        }}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    expect(container.textContent ?? "").toContain("Share");
    expect(container.textContent ?? "").toContain("Follow");
    expect(container.textContent ?? "").toContain("購読する");

    const shareLink = container.querySelector('a[aria-label="Xでシェア"]');
    const followLink = container.querySelector('a[aria-label="Xをフォロー"]');
    const rssLink = container.querySelector('a[aria-label="RSSをフォロー"]');

    expect(shareLink).not.toBeNull();
    expect(followLink).not.toBeNull();
    expect(rssLink).not.toBeNull();
  });

  it("renders related posts grouped by heading", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        navigation={{}}
        relatedPosts={[
          {
            posts: [
              {
                publishedAt: "2025-01-03",
                slug: "typescript-post",
                summary: "Summary TypeScript",
                tags: ["TypeScript"],
                title: "TypeScript Post",
              },
            ],
            tag: "TypeScript",
          },
        ]}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    expect(container.textContent ?? "").toContain("関連する記事");
    expect(container.textContent ?? "").toContain("TypeScript");
    expect(container.textContent ?? "").toContain("記事");
    expect(container.textContent ?? "").toContain("TypeScript Post");
  });

  it("renders previous/next navigation when provided", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        navigation={{
          next: {
            href: "/blog/contents/next",
            publishedAt: "2025-01-03",
            title: "Next",
          },
          prev: {
            href: "/blog/contents/prev",
            publishedAt: "2025-01-01",
            title: "Prev",
          },
        }}
        relatedPosts={[]}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    const nav = container.querySelector('nav[aria-label="記事ナビゲーション"]');
    expect(nav).not.toBeNull();

    const links = Array.from(
      container.querySelectorAll('a[href^="/blog/contents/"]'),
    );
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/blog/contents/next/",
      "/blog/contents/prev/",
    ]);
  });

  it("renders global navigation sticky tabs", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        navigation={{}}
        postNumber={1}
        publishedAt="2025-01-02"
        relatedPosts={[]}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    const nav = container.querySelector(
      'nav[aria-label="グローバルナビゲーション"]',
    );
    expect(nav).not.toBeNull();

    const labels = Array.from(nav?.querySelectorAll("a") ?? []).map(
      (link) => link.textContent,
    );
    expect(labels).toEqual(["ホーム", "自己紹介", "ブログ"]);
  });
});

import { composeStories } from "@storybook/nextjs-vite";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";
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

  it("renders share, follow, subscription, and support sections when provided", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        follow={{
          heading: "Follow",
          items: [
            {
              borderColor: "fg",
              hoverTextColor: "bg",
              href: "https://example.com",
              icon: <FaXTwitter />,
              iconColor: "fg",
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
            hatena: "はてなでシェア",
            web: "デバイスで記事をシェアする",
            x: "Xでシェア",
          },
          text: "Share text",
          url: "https://example.com",
        }}
        subscription={{
          emailLabel: "メールでブログの更新を受け取る",
          emailUrl: "https://follow.it/qxug4e?leanpub",
          heading: "購読する",
          label: "RSSでブログの更新を受け取る",
          url: "https://example.com/rss.xml",
        }}
        support={{
          description:
            "この記事がよかったら、お布施という形で応援してもらえるとうれしいです。",
          heading: "ブログを応援する",
          ofuse: {
            id: "158382",
            label: "おふせぼたん",
            style: "rectangle",
            url: "https://ofuse.me/o?uid=158382",
          },
        }}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    expect(container.textContent ?? "").toContain("Follow");
    expect(container.textContent ?? "").toContain("読者になる");
    expect(container.textContent ?? "").toContain("ブログを応援する");
    expect(container.textContent ?? "").toContain(
      "この記事がよかったら、お布施という形で応援してもらえるとうれしいです。",
    );

    const shareLink = container.querySelector('a[aria-label="Xでシェア"]');
    const blueskyLink = container.querySelector(
      'a[aria-label="Blueskyでシェア"]',
    );
    const hatenaLink = container.querySelector(
      'a[aria-label="はてなでシェア"]',
    );
    const shareButton = container.querySelector(
      'button[aria-label="デバイスで記事をシェアする"]',
    );
    const followLink = container.querySelector('a[aria-label="Xをフォロー"]');
    const rssLink = container.querySelector(
      'a[aria-label="RSSでブログの更新を受け取る"]',
    );
    const emailLink = container.querySelector(
      'a[aria-label="メールでブログの更新を受け取る"]',
    );
    const ofuseLink = container.querySelector(
      'a[data-ofuse-widget-button][data-ofuse-id="158382"]',
    );

    expect(shareLink).not.toBeNull();
    expect(blueskyLink).not.toBeNull();
    expect(hatenaLink).not.toBeNull();
    expect(shareButton).not.toBeNull();
    expect(
      container.querySelector('button[aria-label="記事のリンクをコピー"]'),
    ).toBeNull();
    expect(followLink).not.toBeNull();
    expect(rssLink).not.toBeNull();
    expect(emailLink).not.toBeNull();
    expect(ofuseLink?.getAttribute("href")).toBe(
      "https://ofuse.me/o?uid=158382",
    );
  });

  it("renders a follow profile card when profile data is provided", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        follow={{
          heading: "フォローしてね！",
          items: [
            {
              borderColor: "fg",
              hoverTextColor: "bg",
              href: "https://example.com/x",
              icon: <FaXTwitter />,
              iconColor: "fg",
              label: "Xをフォロー",
            },
            {
              borderColor: "#007bff",
              hoverTextColor: "white",
              href: "https://example.com/bluesky",
              icon: <SiBluesky />,
              iconColor: "#007bff",
              label: "Blueskyをフォロー",
            },
            {
              borderColor: "fg",
              hoverTextColor: "bg",
              href: "https://example.com/github",
              icon: <FaGithub />,
              iconColor: "fg",
              label: "GitHubをフォロー",
            },
          ],
          profile: {
            avatarSrc: "/assets/logo.png",
            description: "Webソフトウェアエンジニア",
            name: "silverbirder",
          },
        }}
        navigation={{}}
        relatedPosts={[]}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    expect(container.textContent ?? "").toContain("silverbirder");
    expect(container.textContent ?? "").toContain("Webソフトウェアエンジニア");
    expect(container.textContent ?? "").not.toContain("フォローしてね！");
    expect(container.querySelector('img[alt="silverbirder"]')).not.toBeNull();
    expect(
      container.querySelector('a[aria-label="Xをフォロー"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('a[aria-label="Blueskyをフォロー"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('a[aria-label="GitHubをフォロー"]'),
    ).not.toBeNull();
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
      "/blog/contents/next",
      "/blog/contents/prev",
    ]);
  });

  it("renders comments after action sections and before navigation", async () => {
    vi.stubEnv("NEXT_PUBLIC_LIKES_API_URL", "https://api.example.com");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ comments: [] }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    window.localStorage.setItem("comments:anon-id", "anon-1");

    try {
      const { container } = await renderWithProvider(
        <Notebook
          comments={{ slug: "test-post" }}
          follow={{
            heading: "筆者をフォローする",
            items: [
              {
                borderColor: "fg",
                hoverTextColor: "bg",
                href: "https://example.com",
                icon: <FaXTwitter />,
                iconColor: "fg",
                label: "Xをフォロー",
              },
            ],
          }}
          navigation={{
            next: {
              href: "/blog/contents/next",
              publishedAt: "2025-01-03",
              title: "Next",
            },
          }}
          relatedPosts={[]}
          tags={[]}
          title="Notebook Preview"
        >
          <p>Body copy.</p>
        </Notebook>,
      );

      await vi.waitFor(() => {
        expect(fetchMock).toHaveBeenCalled();
      });

      const followHeading = container.querySelector("h2");
      const textarea = container.querySelector("textarea");
      const nav = container.querySelector(
        'nav[aria-label="記事ナビゲーション"]',
      );

      expect(followHeading?.textContent).toBe("筆者をフォローする");
      expect(textarea).not.toBeNull();
      expect(container.textContent ?? "").not.toContain("コメント");
      expect(nav).not.toBeNull();
      const followHeadingNode = followHeading as HTMLElement;
      const textareaNode = textarea as HTMLTextAreaElement;
      const navNode = nav as HTMLElement;
      expect(
        followHeadingNode.compareDocumentPosition(textareaNode) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
      expect(
        textareaNode.compareDocumentPosition(navNode) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    } finally {
      vi.unstubAllEnvs();
      vi.unstubAllGlobals();
      window.localStorage.removeItem("comments:anon-id");
    }
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

  it("does not render global navigation when disabled", async () => {
    const { container } = await renderWithProvider(
      <Notebook
        navigation={{}}
        relatedPosts={[]}
        showGlobalNavigation={false}
        tags={[]}
        title="Notebook Preview"
      >
        <p>Body copy.</p>
      </Notebook>,
    );

    const nav = container.querySelector(
      'nav[aria-label="グローバルナビゲーション"]',
    );
    expect(nav).toBeNull();
  });
});

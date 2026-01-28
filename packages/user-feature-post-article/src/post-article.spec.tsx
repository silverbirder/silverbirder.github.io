import type { AnchorHTMLAttributes, ReactNode } from "react";

import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it, vi } from "vitest";

import { PostArticle } from "./post-article";
import * as stories from "./post-article.stories";
import { renderWithProvider } from "./test-util";

type NextLinkMockProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode;
  href?: unknown;
};

vi.mock("next/link", () => {
  const Link = ({ children, href, ...props }: NextLinkMockProps) => {
    const resolvedHref =
      typeof href === "string" ? href : href ? String(href) : "";
    return (
      <a href={resolvedHref ?? ""} {...props}>
        {children}
      </a>
    );
  };

  return { __esModule: true, default: Link };
});

const Stories = composeStories(stories);
const followLinks = {
  bluesky: "https://bsky.app/profile/example.bsky.social",
  github: "https://github.com/example",
  rss: "https://example.com/rss.xml",
  threads: "https://www.threads.com/@example",
  x: "https://x.com/example",
};

describe("PostArticle", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the article with notebook prose", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Testing"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    expect(document.body.textContent ?? "").not.toContain("絞り込み");
    expect(document.body.textContent ?? "").toContain("Test title");
  });

  it("renders the robot badge as indexed by default", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Testing"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    const robotBadge = document.querySelector(
      '[data-testid="post-article-robot"] [data-index-status]',
    );
    expect(robotBadge?.getAttribute("data-index-status")).toBe("index");
  });

  it("renders the robot badge as noindex when index is false", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          index: false,
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Testing"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    const robotBadge = document.querySelector(
      '[data-testid="post-article-robot"] [data-index-status]',
    );
    expect(robotBadge?.getAttribute("data-index-status")).toBe("noindex");
  });

  it("renders compiled source via provider wrapper", async () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  return _jsx("p", {
    children: "Body copy."
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`;

    await renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Testing"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    const paragraph = document.querySelector("p");
    expect(paragraph?.textContent ?? "").toContain("Body copy.");
  });

  it("renders share buttons", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Testing"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    const bodyText = document.body.textContent ?? "";
    expect(bodyText).toContain("シェアする");
    expect(bodyText).toContain("フォローする");
    expect(document.querySelector('a[aria-label="Xでシェア"]')).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="Blueskyでシェア"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="はてなでシェア"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="LINEでシェア"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="Facebookでシェア"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="Threadsでシェア"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('button[aria-label="デバイスで共有"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('button[aria-label="リンクをコピー"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="Xをフォロー"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="Blueskyをフォロー"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="GitHubをフォロー"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="Threadsをフォロー"]'),
    ).not.toBeNull();
    expect(
      document.querySelector('a[aria-label="RSSをフォロー"]'),
    ).not.toBeNull();
  });

  it("renders scroll progress bar", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Testing"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    expect(
      document.querySelector('[data-testid="scroll-progress-bar"]'),
    ).not.toBeNull();
  });

  it("renders the published date and tags", async () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
const {useMDXComponents: _provideComponents} = arguments[0];
function _createMdxContent(props) {
  return _jsx("p", {
    children: "Body copy."
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
return {
  default: MDXContent
};
`;

    await renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "2025-01-02",
          tags: ["Chakra", "Design"],
          title: "Test title",
        }}
        navigation={{}}
        relatedPosts={[]}
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    const timeElement = document.querySelector("time");
    expect(timeElement?.textContent ?? "").toBe("2025. 01. 02");
    expect(document.body.textContent ?? "").toContain("Chakra");
    expect(document.body.textContent ?? "").toContain("Design");
  });

  it("renders related posts grouped by tag", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "",
          tags: [],
          title: "Test title",
        }}
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
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    expect(document.body.textContent ?? "").toContain("関連する記事");
    expect(document.body.textContent ?? "").toContain("TypeScript");
    expect(document.body.textContent ?? "").toContain("記事");
    expect(document.body.textContent ?? "").toContain("TypeScript Post");
  });

  it("renders previous/next navigation when provided", () => {
    const compiledSource = `"use strict";
const {jsx: _jsx} = arguments[0];
function MDXContent() {
  return _jsx("p", {
    children: "hello"
  });
}
return {
  default: MDXContent
};
`;

    renderWithProvider(
      <PostArticle
        compiledSource={compiledSource}
        followLinks={followLinks}
        meta={{
          postNumber: 1,
          publishedAt: "",
          tags: [],
          title: "Test title",
        }}
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
        shareUrl="https://example.com/blog/contents/test/"
      />,
    );

    const nav = document.querySelector('nav[aria-label="記事ナビゲーション"]');
    expect(nav).not.toBeNull();
    expect(document.body.textContent ?? "").toContain("前のページ");
    expect(document.body.textContent ?? "").toContain("次のページ");
  });
});

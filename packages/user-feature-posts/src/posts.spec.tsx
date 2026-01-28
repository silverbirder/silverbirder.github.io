import type { AnchorHTMLAttributes, ReactNode } from "react";

import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it, vi } from "vitest";

import type { PostSummary } from "./posts.presenter";

import { Posts } from "./posts";
import * as stories from "./posts.stories";
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

let mockedSearchParams = "";

vi.mock("next/navigation", () => {
  return {
    usePathname: () => "/blog",
    useSearchParams: () => new URLSearchParams(mockedSearchParams),
  };
});

const Stories = composeStories(stories);

const createPosts = (): PostSummary[] => [
  {
    publishedAt: "2026-01-12",
    slug: "a",
    summary: "Summary A",
    tags: ["TypeScript"],
    title: "A",
  },
  {
    publishedAt: "2026-01-11",
    slug: "b",
    summary: "Summary B",
    tags: [],
    title: "B",
  },
  {
    publishedAt: "2026-01-10",
    slug: "c",
    summary: "Summary C",
    tags: [],
    title: "C",
  },
  {
    publishedAt: "2026-01-09",
    slug: "d",
    summary: "Summary D",
    tags: [],
    title: "D",
  },
  {
    publishedAt: "2026-01-08",
    slug: "e",
    summary: "Summary E",
    tags: [],
    title: "E",
  },
  {
    publishedAt: "2026-01-07",
    slug: "f",
    summary: "Summary F",
    tags: [],
    title: "F",
  },
];

describe("Posts", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();
    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders up to 10 posts per page in descending order", async () => {
    mockedSearchParams = "";
    await renderWithProvider(<Posts posts={[...createPosts()]} />);

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href^="/blog/contents/"]',
      ),
    );

    const uniqueLinks: HTMLAnchorElement[] = [];
    const seenHrefs = new Set<string>();
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      if (seenHrefs.has(href)) {
        continue;
      }
      seenHrefs.add(href);
      uniqueLinks.push(link);
    }

    expect(uniqueLinks).toHaveLength(6);
    expect(uniqueLinks.map((a) => a.textContent)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ]);
  });

  it("falls back to page 1 when requesting page 2 within 10 items", async () => {
    mockedSearchParams = "page=2";
    await renderWithProvider(<Posts posts={[...createPosts()]} />);

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(
        'a[href^="/blog/contents/"]',
      ),
    );

    const uniqueLinks: HTMLAnchorElement[] = [];
    const seenHrefs = new Set<string>();
    for (const link of links) {
      const href = link.getAttribute("href") ?? "";
      if (seenHrefs.has(href)) {
        continue;
      }
      seenHrefs.add(href);
      uniqueLinks.push(link);
    }

    expect(uniqueLinks).toHaveLength(6);
    expect(uniqueLinks.map((a) => a.textContent)).toEqual([
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
    ]);

    const prev = Array.from(document.querySelectorAll("a")).find(
      (a) => a.textContent === "前へ",
    );
    const next = Array.from(document.querySelectorAll("a")).find(
      (a) => a.textContent === "次へ",
    );
    const page1 = Array.from(document.querySelectorAll("a")).find(
      (a) => a.textContent === "1",
    );

    expect(prev).toBeUndefined();
    expect(page1).toBeUndefined();
    expect(next).toBeUndefined();
  });
});

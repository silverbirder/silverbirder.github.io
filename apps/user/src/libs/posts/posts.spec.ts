import type { PostSummary } from "@repo/user-feature-posts";

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getAdjacentPosts,
  getPostFrontmatter,
  getPostSlugs,
  getRelatedPostsByTags,
} from ".";

const { readdir, readFile } = vi.hoisted(() => ({
  readdir: vi.fn(),
  readFile: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  readdir,
  readFile,
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("getAdjacentPosts", () => {
  const posts: PostSummary[] = [
    {
      publishedAt: "2026-01-12",
      slug: "first",
      summary: "Summary First",
      tags: [],
      title: "First",
    },
    {
      publishedAt: "2026-01-11",
      slug: "second",
      summary: "Summary Second",
      tags: [],
      title: "Second",
    },
    {
      publishedAt: "2026-01-10",
      slug: "third",
      summary: "Summary Third",
      tags: [],
      title: "Third",
    },
  ];

  it("returns previous and next posts when slug is in the middle", () => {
    const result = getAdjacentPosts(posts, "second");

    expect(result.nextPost?.slug).toBe("first");
    expect(result.prevPost?.slug).toBe("third");
  });

  it("returns null for nextPost when slug is the first", () => {
    const result = getAdjacentPosts(posts, "first");

    expect(result.nextPost).toBeNull();
    expect(result.prevPost?.slug).toBe("second");
  });

  it("returns null for prevPost when slug is the last", () => {
    const result = getAdjacentPosts(posts, "third");

    expect(result.nextPost?.slug).toBe("second");
    expect(result.prevPost).toBeNull();
  });

  it("returns nulls when slug does not exist", () => {
    const result = getAdjacentPosts(posts, "missing");

    expect(result.prevPost).toBeNull();
    expect(result.nextPost).toBeNull();
  });
});

describe("getPostSlugs", () => {
  it("returns slugs sorted by publishedAt and excludes entries without publishedAt", async () => {
    readdir.mockResolvedValue([
      { isFile: () => true, name: "first.md" },
      { isFile: () => true, name: "second.md" },
      { isFile: () => true, name: "draft.md" },
      { isFile: () => true, name: "notes.txt" },
    ]);
    readFile.mockImplementation((filePath: string) => {
      if (filePath.endsWith("first.md")) {
        return `---
title: 'First'
publishedAt: '2020-01-01'
---`;
      }
      if (filePath.endsWith("second.md")) {
        return `---
title: 'Second'
publishedAt: '2021-01-01'
---`;
      }
      if (filePath.endsWith("draft.md")) {
        return `---
title: 'Draft'
---`;
      }
      return "";
    });

    const slugs = await getPostSlugs();

    expect(slugs).toEqual([
      { publishedAt: "2021-01-01", slug: "second" },
      { publishedAt: "2020-01-01", slug: "first" },
    ]);
    expect(readdir).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledTimes(3);
  });
});

describe("getRelatedPostsByTags", () => {
  const posts: PostSummary[] = [
    {
      publishedAt: "2026-01-12",
      slug: "current",
      summary: "Summary Current",
      tags: ["TypeScript", "Design"],
      title: "Current",
    },
    {
      publishedAt: "2026-01-11",
      slug: "typescript-post",
      summary: "Summary TypeScript",
      tags: ["TypeScript"],
      title: "TypeScript Post",
    },
    {
      publishedAt: "2026-01-10",
      slug: "design-post",
      summary: "Summary Design",
      tags: ["Design"],
      title: "Design Post",
    },
    {
      publishedAt: "2026-01-09",
      slug: "other-post",
      summary: "Summary Other",
      tags: ["Other"],
      title: "Other Post",
    },
  ];

  it("returns related posts grouped by unique tags", () => {
    const groups = getRelatedPostsByTags(posts, {
      slug: "current",
      tags: ["TypeScript", " Design ", "TypeScript", ""],
    });

    expect(groups).toEqual([
      {
        posts: [
          {
            publishedAt: "2026-01-11",
            slug: "typescript-post",
            summary: "Summary TypeScript",
            tags: ["TypeScript"],
            title: "TypeScript Post",
          },
        ],
        tag: "TypeScript",
      },
      {
        posts: [
          {
            publishedAt: "2026-01-10",
            slug: "design-post",
            summary: "Summary Design",
            tags: ["Design"],
            title: "Design Post",
          },
        ],
        tag: "Design",
      },
    ]);
  });

  it("respects the limit and excludes the current post", () => {
    const morePosts: PostSummary[] = [
      ...posts,
      {
        publishedAt: "2026-01-08",
        slug: "typescript-post-2",
        summary: "Summary TypeScript 2",
        tags: ["TypeScript"],
        title: "TypeScript Post 2",
      },
      {
        publishedAt: "2026-01-07",
        slug: "typescript-post-3",
        summary: "Summary TypeScript 3",
        tags: ["TypeScript"],
        title: "TypeScript Post 3",
      },
    ];

    const groups = getRelatedPostsByTags(morePosts, {
      limit: 2,
      slug: "current",
      tags: ["TypeScript"],
    });

    expect(groups).toEqual([
      {
        posts: [
          {
            publishedAt: "2026-01-11",
            slug: "typescript-post",
            summary: "Summary TypeScript",
            tags: ["TypeScript"],
            title: "TypeScript Post",
          },
          {
            publishedAt: "2026-01-08",
            slug: "typescript-post-2",
            summary: "Summary TypeScript 2",
            tags: ["TypeScript"],
            title: "TypeScript Post 2",
          },
        ],
        tag: "TypeScript",
      },
    ]);
  });
});

describe("getPostFrontmatter", () => {
  it("returns frontmatter with parsed tags", async () => {
    readFile.mockResolvedValue(`---
title: "Tagged post"
publishedAt: "2025-01-01"
summary: "Summary"
tags: [nextjs, mdx]
---`);

    const frontmatter = await getPostFrontmatter("example");

    expect(frontmatter).toEqual({
      publishedAt: "2025-01-01",
      summary: "Summary",
      tags: ["nextjs", "mdx"],
      title: "Tagged post",
    });
    expect(readFile).toHaveBeenCalledTimes(1);
  });

  it("strips stray quotes from tag values", async () => {
    readFile.mockResolvedValue(`---
title: "Quoted tags"
publishedAt: "2025-01-03"
tags: ["AI, "Design System", "  Frontend  "]
---`);

    const frontmatter = await getPostFrontmatter("example");

    expect(frontmatter.tags).toEqual(["AI", "Design System", "Frontend"]);
  });

  it("returns undefined tags when frontmatter omits tags", async () => {
    readFile.mockResolvedValue(`---
title: "No tags"
publishedAt: "2025-01-02"
---`);

    const frontmatter = await getPostFrontmatter("example");

    expect(frontmatter.tags).toBeUndefined();
  });

  it("parses index: false as false", async () => {
    readFile.mockResolvedValue(`---
title: "No tags"
publishedAt: "2025-01-02"
index: false
---`);

    const frontmatter = await getPostFrontmatter("example");

    expect(frontmatter.index).toBe(false);
  });

  it("parses index: true as true", async () => {
    readFile.mockResolvedValue(`---
title: "No tags"
publishedAt: "2025-01-02"
index: true
---`);

    const frontmatter = await getPostFrontmatter("example");

    expect(frontmatter.index).toBe(true);
  });
});

import type { PostSummary } from "@repo/user-feature-posts";

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const contentDir = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "posts",
);

export type PostFrontmatter = {
  index?: boolean;
  publishedAt?: string;
  summary?: string;
  tags?: string[];
  title?: string;
};

export type PostSlug = {
  publishedAt: string;
  slug: string;
};

export type RelatedPostItem = {
  publishedAt?: string;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
};

export type RelatedPostsGroup = {
  posts: RelatedPostItem[];
  tag: string;
};

type AdjacentPosts = {
  nextPost: null | PostSummary;
  prevPost: null | PostSummary;
};

export const getPostSlugs = async () => {
  const entries = await readdir(contentDir, { withFileTypes: true } as const);
  const slugs = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await readFile(
        path.join(contentDir, `${slug}.md`),
        "utf8",
      );
      const publishedAt = extractPublishedAt(content);
      if (!publishedAt) {
        return null;
      }

      return { dateValue: toDateValue(publishedAt), publishedAt, slug };
    }),
  );

  return posts
    .filter(
      (
        post,
      ): post is {
        dateValue: number;
        publishedAt: string;
        slug: string;
      } => post !== null,
    )
    .sort((a, b) => b.dateValue - a.dateValue)
    .map(({ publishedAt, slug }) => ({ publishedAt, slug }));
};

export const getPostFrontmatter = async (
  slug: string,
): Promise<PostFrontmatter> => {
  const content = await readFile(path.join(contentDir, `${slug}.md`), "utf8");
  return {
    index: parseIndex(extractFrontmatterValue(content, "index")),
    publishedAt: extractFrontmatterValue(content, "publishedAt") ?? undefined,
    summary: extractFrontmatterValue(content, "summary") ?? undefined,
    tags: parseTags(extractFrontmatterValue(content, "tags")),
    title: extractFrontmatterValue(content, "title") ?? undefined,
  };
};

const extractFrontmatterValue = (content: string, key: string) => {
  const frontmatter = extractFrontmatterBlock(content);
  if (!frontmatter) {
    return null;
  }

  const line = frontmatter
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}:`));
  if (!line) {
    return null;
  }

  const rawValue = line.replace(new RegExp(`^\\s*${key}:\\s*`), "");
  const raw = rawValue.replace(/^\s+|\s+$/g, "");
  if (raw === "") {
    return null;
  }

  const quote = raw.charAt(0);
  if ((quote === "'" || quote === '"') && raw.endsWith(quote)) {
    return raw.slice(1, -1);
  }

  return raw;
};

const parseTags = (value: null | string) => {
  if (!value) {
    return undefined;
  }

  const trimmed = value.replace(/^\s+|\s+$/g, "");
  if (!trimmed) {
    return undefined;
  }

  const normalized =
    trimmed.startsWith("[") && trimmed.endsWith("]")
      ? trimmed.slice(1, -1)
      : trimmed;

  const tags = normalized
    .split(",")
    .map((tag) => {
      const cleaned = tag.replace(/^\s+|\s+$/g, "");
      return cleaned.replace(/^['"]+|['"]+$/g, "").replace(/^\s+|\s+$/g, "");
    })
    .filter((tag) => tag.length > 0);

  return tags.length > 0 ? tags : undefined;
};

const parseIndex = (value: null | string): boolean | undefined => {
  if (!value) return undefined;
  const trimmed = value.replace(/^\s+|\s+$/g, "").toLowerCase();
  if (trimmed === "") return true;
  if (trimmed === "false") return false;
  return true;
};

const extractFrontmatterBlock = (content: string) => {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  return match[1] ?? null;
};

const extractPublishedAt = (content: string) => {
  return extractFrontmatterValue(content, "publishedAt");
};

const toDateValue = (publishedAt: string) => {
  const dateValue = Date.parse(publishedAt);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

export const getAdjacentPosts = (
  posts: PostSummary[],
  slug: string,
): AdjacentPosts => {
  const currentIndex = posts.findIndex((post) => post.slug === slug);
  if (currentIndex < 0) {
    return { nextPost: null, prevPost: null };
  }

  const nextPost =
    currentIndex > 0 ? (posts.at(currentIndex - 1) ?? null) : null;
  const prevPost =
    currentIndex < posts.length - 1
      ? (posts.at(currentIndex + 1) ?? null)
      : null;

  return { nextPost, prevPost };
};

export const getRelatedPostsByTags = (
  posts: PostSummary[],
  input: {
    limit?: number;
    slug: string;
    tags?: string[];
  },
): RelatedPostsGroup[] => {
  const limit = input.limit ?? 3;
  if (limit <= 0) {
    return [];
  }

  const uniqueTags = (() => {
    const seen = new Set<string>();
    const tags = input.tags ?? [];
    return tags
      .map((tag) => tag.replace(/^\s+|\s+$/g, ""))
      .filter((tag) => tag.length > 0)
      .filter((tag) => {
        if (seen.has(tag)) {
          return false;
        }
        seen.add(tag);
        return true;
      });
  })();

  return uniqueTags
    .map((tag) => {
      const related = posts
        .filter((post) => post.slug !== input.slug && post.tags.includes(tag))
        .slice(0, limit)
        .map((post) => ({
          publishedAt: post.publishedAt,
          slug: post.slug,
          summary: post.summary,
          tags: post.tags,
          title: post.title,
        }));
      return { posts: related, tag };
    })
    .filter((group) => group.posts.length > 0);
};

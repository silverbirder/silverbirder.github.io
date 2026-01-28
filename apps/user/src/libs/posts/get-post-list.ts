import type { PostSummary } from "@repo/user-feature-posts";

import { getPostFrontmatter, getPostSlugs } from "./posts";

const loadPostFrontmatter = async (slug: string) => {
  return getPostFrontmatter(slug);
};

export const getPostList = async (
  loader: (
    slug: string,
  ) => Promise<Record<string, unknown>> = loadPostFrontmatter,
) => {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(
    slugs.map(async ({ publishedAt, slug }) => {
      const frontmatter = await loader(slug);
      const title =
        typeof frontmatter.title === "string" ? frontmatter.title : slug;
      const summary =
        typeof frontmatter.summary === "string" ? frontmatter.summary : "";
      const tags = Array.isArray(frontmatter.tags)
        ? frontmatter.tags.filter(
            (tag): tag is string => typeof tag === "string",
          )
        : [];
      return { publishedAt, slug, summary, tags, title } satisfies PostSummary;
    }),
  );

  return posts;
};

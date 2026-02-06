import type { Metadata } from "next";

import { siteDescription, siteName } from "@repo/metadata";
import { PostArticle } from "@repo/user-feature-post-article";
import { normalizePosts } from "@repo/user-feature-posts";
import { buildSiteUrl } from "@repo/util";
import { serialize } from "next-mdx-remote-client/serialize";
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import path from "node:path";

import {
  getAdjacentPosts,
  getPostFrontmatter,
  getPostList,
  getRelatedPostsByTags,
} from "@/libs";
import { createMdxOptions } from "@/libs/mdx/mdx-options";

export { generateStaticParams } from "./static-params";

export async function generateMetadata(
  props: PageProps<"/blog/contents/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ogImageUrl = buildSiteUrl(`blog/contents/${slug}/opengraph-image`);

  try {
    const frontmatter = await getPostFrontmatter(slug);
    const title = frontmatter.title ?? siteName;
    const description = frontmatter.summary ?? siteDescription;
    const canonical = buildSiteUrl(`blog/contents/${slug}/`);
    const tags = frontmatter.tags?.length ? frontmatter.tags : undefined;

    return {
      alternates: {
        canonical,
      },
      description,
      keywords: tags ?? [siteName, "ブログ", "記事"],
      openGraph: {
        description,
        images: [
          {
            alt: title,
            height: 630,
            url: ogImageUrl,
            width: 1200,
          },
        ],
        publishedTime: frontmatter.publishedAt,
        siteName,
        tags,
        title,
        type: "article",
        url: canonical,
      },
      robots: {
        index: frontmatter.index === false ? false : true,
      },
      title,
      twitter: {
        description,
        images: [ogImageUrl],
        title,
      },
    };
  } catch {
    notFound();
  }
}

const contentDir = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "posts",
);

const loadPostSource = async (slug: string) => {
  return readFile(path.join(contentDir, `${slug}.md`), "utf8");
};

export default async function Page(props: PageProps<"/blog/contents/[slug]">) {
  const { slug } = await props.params;

  try {
    const frontmatter = await getPostFrontmatter(slug);
    const postList = await getPostList();
    const normalizedPosts = normalizePosts(postList);
    const source = await loadPostSource(slug);
    const compiled = await serialize({
      options: {
        disableExports: true,
        disableImports: true,
        mdxOptions: createMdxOptions(),
      },
      source,
    });
    if (!("compiledSource" in compiled) || !compiled.compiledSource) {
      notFound();
    }

    const { nextPost, prevPost } = getAdjacentPosts(normalizedPosts, slug);
    const relatedPosts = getRelatedPostsByTags(normalizedPosts, {
      slug,
      tags: frontmatter.tags,
    });
    const shareUrl = buildSiteUrl(`blog/contents/${slug}/`);
    const rssUrl = buildSiteUrl("rss.xml");
    const followLinks = {
      bluesky: "https://bsky.app/profile/silverbirder.bsky.social",
      github: "https://github.com/silverbirder",
      rss: rssUrl,
      threads: "https://www.threads.com/@silverbirder",
      x: "https://x.com/silverbirder",
    };
    const currentIndex = normalizedPosts.findIndex(
      (post) => post.slug === slug,
    );
    const postNumber =
      currentIndex >= 0 ? normalizedPosts.length - currentIndex : undefined;

    return (
      <PostArticle
        compiledSource={compiled.compiledSource}
        followLinks={followLinks}
        meta={{
          index: frontmatter.index,
          postNumber,
          publishedAt: frontmatter.publishedAt ?? "",
          tags: frontmatter.tags ?? [],
          title: frontmatter.title ?? "",
        }}
        navigation={{
          next: nextPost
            ? {
                href: `/blog/contents/${nextPost.slug}`,
                publishedAt: nextPost.publishedAt ?? "",
                title: nextPost.title,
              }
            : undefined,
          prev: prevPost
            ? {
                href: `/blog/contents/${prevPost.slug}`,
                publishedAt: prevPost.publishedAt ?? "",
                title: prevPost.title,
              }
            : undefined,
        }}
        relatedPosts={relatedPosts ?? []}
        shareUrl={shareUrl}
      />
    );
  } catch {
    notFound();
  }
}

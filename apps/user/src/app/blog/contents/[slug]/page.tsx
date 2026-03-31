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
import { createUserLinkCardResolver } from "@/libs/link-card";
import { createMdxOptions } from "@/libs/mdx/mdx-options";

export { generateStaticParams } from "./static-params";

const mergeUniqueKeywords = (values: Array<string[] | undefined>) => {
  const seen = new Set<string>();

  return values
    .flatMap((value) => value ?? [])
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .filter((value) => {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
};

export const buildBlogPostingJsonLd = (input: {
  canonical: string;
  description: string;
  imageUrl: string;
  keywords?: string[];
  publishedAt?: string;
  title: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: "silverbirder",
    },
    headline: input.title,
    image: [input.imageUrl],
    keywords: input.keywords,
    mainEntityOfPage: {
      "@id": input.canonical,
      "@type": "WebPage",
    },
    publisher: {
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: buildSiteUrl("assets/logo.png"),
      },
      name: siteName,
    },
    url: input.canonical,
    ...(input.description ? { description: input.description } : {}),
    ...(input.publishedAt ? { datePublished: input.publishedAt } : {}),
  };
};

export async function generateMetadata(
  props: PageProps<"/blog/contents/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ogImageUrl = buildSiteUrl(`blog/contents/${slug}/opengraph-image.png`);

  try {
    const frontmatter = await getPostFrontmatter(slug);
    const title = frontmatter.title ?? siteName;
    const description = frontmatter.summary ?? siteDescription;
    const canonical = buildSiteUrl(`blog/contents/${slug}/`);
    const tags = frontmatter.tags?.length ? frontmatter.tags : undefined;
    const keywords = mergeUniqueKeywords([
      frontmatter.tags,
      frontmatter.keywords,
    ]);

    return {
      alternates: {
        canonical,
      },
      description,
      keywords,
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
        googleBot: {
          follow: true,
          index: frontmatter.index === false ? false : true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
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
    const resolveLinkCard = await createUserLinkCardResolver();
    const compiled = await serialize({
      options: {
        disableExports: true,
        disableImports: true,
        mdxOptions: createMdxOptions({ resolveLinkCard }),
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
    const jsonLd = buildBlogPostingJsonLd({
      canonical: shareUrl,
      description: frontmatter.summary ?? siteDescription,
      imageUrl: buildSiteUrl(`blog/contents/${slug}/opengraph-image.png`),
      keywords: mergeUniqueKeywords([frontmatter.tags, frontmatter.keywords]),
      publishedAt: frontmatter.publishedAt,
      title: frontmatter.title ?? "",
    });
    const rssUrl = buildSiteUrl("rss.xml");
    const followLinks = {
      bluesky: "https://bsky.app/profile/silverbirder.bsky.social",
      github: "https://github.com/silverbirder",
      rss: rssUrl,
      x: "https://x.com/silverbirder",
    };
    const currentIndex = normalizedPosts.findIndex(
      (post) => post.slug === slug,
    );
    const postNumber =
      currentIndex >= 0 ? normalizedPosts.length - currentIndex : undefined;

    return (
      <>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type="application/ld+json"
        />
        <PostArticle
          compiledSource={compiled.compiledSource}
          followLinks={followLinks}
          followProfileAvatarSrc={buildSiteUrl("assets/logo.png")}
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
          slug={slug}
        />
      </>
    );
  } catch {
    notFound();
  }
}

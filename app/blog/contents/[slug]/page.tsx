import { notFound } from "next/navigation";
import { CustomMDX } from "app/components/mdx";
import { baseUrl } from "app/sitemap";
import { getBlogPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";
import dynamic from "next/dynamic";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const {
    title,
    publishedAt: publishedTime,
    summary: description,
    index,
  } = post.metadata;
  const ogImage = `/opengraph-image.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${baseUrl}/blog/contents/${post.slug}/`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const DiscusNoSSR = dynamic(() => import("@/lib/discus"), {
  ssr: false,
});

export default function Blog({ params }) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/contents/${post.slug}/`,
            author: {
              "@type": "Person",
              name: "silverbirder",
            },
          }),
        }}
      />
      <article className="prose max-w-none">
        <header className="flex flex-col items-start mb-6 leading-12">
          <h1 className="font-bold text-2xl leading-[3rem] my-0">
            {post.metadata.title}
          </h1>
          <time
            className="self-end text-xs leading-6 text-muted"
            dateTime={post.metadata.publishedAt}
          >
            {formatDate(post.metadata.publishedAt)}
          </time>
        </header>
        <section>
          <CustomMDX source={post.content} />
        </section>
        <footer className="bg-yellow-100 rounded-lg mt-12 mb-36 p-6">
          <DiscusNoSSR url={`${baseUrl}/blog/contents/${params.slug}/`} />
        </footer>
      </article>
    </>
  );
}

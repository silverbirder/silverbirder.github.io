import { getBlogPosts } from "@/lib/blog";
import { baseUrl } from "app/sitemap";

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const allBlogs = await getBlogPosts();

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1;
      }
      return 1;
    })
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.metadata.title)}</title>
          <link>${baseUrl}/blog/contents/${post.slug}/</link>
          <description>${escapeXml(post.metadata.summary || "")}</description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>silverbirder</title>
        <link>${baseUrl}</link>
        <description>This is silverbirder RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}

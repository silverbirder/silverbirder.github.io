import type { LinkCardMetadata } from "@repo/util";

import { normalizeLinkCardUrl } from "@repo/util";
import { readFile } from "node:fs/promises";
import path from "node:path";

type LinkCardManifest = Record<string, LinkCardMetadata>;

const manifestPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "link-cards.json",
);

const resolveText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pickMetaContent = (
  html: string,
  attribute: "name" | "property",
  name: string,
) => {
  const pattern = new RegExp(
    `<meta[^>]+${attribute}=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+${attribute}=["']${escapeRegExp(name)}["'][^>]*>`,
    "i",
  );
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2] ?? null;
};

const pickBaseHref = (html: string) =>
  html.match(/<base[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;

const pickTagAttribute = (tag: string, attributeName: string) =>
  tag
    .match(
      new RegExp(`${attributeName}=(?:"([^"]+)"|'([^']+)'|([^\\s>]+))`, "i"),
    )
    ?.slice(1)
    .find((value) => value != null) ?? null;

const collectLinkHrefs = (
  html: string,
  predicate: (relValue: string) => boolean,
) => {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return tags.flatMap((tag) => {
    const href = pickTagAttribute(tag, "href");
    const rel = pickTagAttribute(tag, "rel")?.toLowerCase();
    if (!href || !rel || !predicate(rel)) {
      return [];
    }
    return [href];
  });
};

const collectFaviconCandidates = (html: string) => {
  const iconHrefs = collectLinkHrefs(html, (relValue) =>
    relValue.split(/\s+/).includes("icon"),
  );
  const appleTouchIconHrefs = collectLinkHrefs(html, (relValue) =>
    relValue.split(/\s+/).some((token) => token.startsWith("apple-touch-icon")),
  );

  const resolvePriority = (href: string) => {
    const normalized = href.toLowerCase();
    if (normalized.endsWith(".svg")) return 0;
    if (normalized.endsWith(".png")) return 1;
    if (normalized.endsWith(".webp")) return 2;
    if (normalized.endsWith(".avif")) return 3;
    if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) return 4;
    if (normalized.endsWith(".gif")) return 5;
    if (normalized.endsWith(".ico")) return 6;
    return 7;
  };

  return [
    ...Array.from(new Set(iconHrefs)).sort(
      (left, right) => resolvePriority(left) - resolvePriority(right),
    ),
    ...Array.from(new Set(appleTouchIconHrefs)),
    "/favicon.ico",
  ];
};

const pickTitle = (html: string) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) {
    return null;
  }
  return resolveText(match[1]);
};

const normalizeCharset = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^["']|["']$/g, "")
    .replace(/^shift-jis$/i, "shift_jis")
    .replace(/^x-sjis$/i, "shift_jis")
    .replace(/^sjis$/i, "shift_jis")
    .replace(/^utf8$/i, "utf-8");

const pickCharset = (html: string, contentType: null | string) => {
  const headerMatch = contentType?.match(/charset=([^;]+)/i)?.[1];
  if (headerMatch) {
    return normalizeCharset(headerMatch);
  }

  const metaCharsetMatch = html.match(
    /<meta[^>]+charset=["']?\s*([^"'\s/>]+)/i,
  )?.[1];
  if (metaCharsetMatch) {
    return normalizeCharset(metaCharsetMatch);
  }

  const metaContentTypeMatch = html.match(
    /<meta[^>]+content=["'][^"']*charset=([^"';\s]+)[^"']*["'][^>]*>/i,
  )?.[1];
  if (metaContentTypeMatch) {
    return normalizeCharset(metaContentTypeMatch);
  }

  return "utf-8";
};

const decodeHtml = (
  buffer: Buffer<ArrayBuffer>,
  contentType: null | string,
) => {
  const latin1 = buffer.toString("latin1");
  const charset = pickCharset(latin1, contentType);

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
};

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const resolveAbsoluteUrl = (value: null | string, baseUrl: string) => {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(decodeHtmlEntities(value), baseUrl).toString();
  } catch {
    return undefined;
  }
};

const resolveAvailableAssetUrl = async (values: string[], baseUrl: string) => {
  for (const value of values) {
    const assetUrl = resolveAbsoluteUrl(value, baseUrl);
    if (!assetUrl) {
      continue;
    }

    try {
      const response = await fetch(assetUrl, {
        headers: {
          Accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
          Referer: baseUrl,
          "User-Agent": "silverbirder-link-card/1.0",
        },
      });
      if (response.ok) {
        return assetUrl;
      }
    } catch {
      continue;
    }
  }

  return undefined;
};

const fetchLinkCardMetadata = async (
  url: string,
): Promise<LinkCardMetadata | null> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
        "User-Agent": "silverbirder-link-card/1.0",
      },
    });
    if (!response.ok) {
      return null;
    }

    const html = decodeHtml(
      Buffer.from(await response.arrayBuffer()),
      response.headers.get("content-type"),
    );
    const title =
      pickMetaContent(html, "property", "og:title") ?? pickTitle(html);
    if (!title) {
      return null;
    }

    const documentBaseUrl = resolveAbsoluteUrl(pickBaseHref(html), url) ?? url;
    const faviconSrc = await resolveAvailableAssetUrl(
      collectFaviconCandidates(html),
      documentBaseUrl,
    );

    return {
      description:
        pickMetaContent(html, "property", "og:description") ??
        pickMetaContent(html, "name", "description") ??
        undefined,
      ...(faviconSrc ? { faviconSrc } : {}),
      siteName:
        pickMetaContent(html, "property", "og:site_name") ??
        new URL(url).hostname.replace(/^www\./, ""),
      thumbnailSrc:
        resolveAbsoluteUrl(
          pickMetaContent(html, "property", "og:image"),
          url,
        ) ??
        resolveAbsoluteUrl(pickMetaContent(html, "name", "twitter:image"), url),
      title,
      url,
    };
  } catch {
    return null;
  }
};

const loadManifest = async (): Promise<LinkCardManifest> => {
  try {
    const source = await readFile(manifestPath, "utf8");
    const parsed = JSON.parse(source) as unknown;
    return parsed && typeof parsed === "object"
      ? (parsed as LinkCardManifest)
      : {};
  } catch {
    return {};
  }
};

export const createUserLinkCardResolver = async () => {
  const manifest = await loadManifest();
  return async (url: string) => {
    const normalizedUrl = normalizeLinkCardUrl(url);
    return (
      manifest[normalizedUrl] ?? (await fetchLinkCardMetadata(normalizedUrl))
    );
  };
};

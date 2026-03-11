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

const pickLinkHref = (html: string, relPattern: string) => {
  const pattern = new RegExp(
    `<link[^>]+rel=["'][^"']*${relPattern}[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>|<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*${relPattern}[^"']*["'][^>]*>`,
    "i",
  );
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2] ?? null;
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

    return {
      description:
        pickMetaContent(html, "property", "og:description") ??
        pickMetaContent(html, "name", "description") ??
        undefined,
      faviconSrc:
        resolveAbsoluteUrl(pickLinkHref(html, "apple-touch-icon"), url) ??
        resolveAbsoluteUrl(pickLinkHref(html, "icon"), url) ??
        resolveAbsoluteUrl("/favicon.ico", url),
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

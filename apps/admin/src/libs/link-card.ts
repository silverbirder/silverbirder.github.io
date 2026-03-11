import type { LinkCardMetadata } from "@repo/util";

import { extractStandaloneLinkUrls, normalizeLinkCardUrl } from "@repo/util";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

type LinkCardManifest = Record<string, LinkCardMetadata>;

type PullRequestFile = {
  content: string;
  encoding?: "base64" | "utf8";
  path: string;
};

type RemoteAsset = {
  content: string;
  encoding: "base64";
  publicSrc: string;
  repoPath: string;
};

const normalizeHost = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");

const repoRoot = path.resolve(process.cwd(), "..", "..");
const manifestPath = path.join(
  repoRoot,
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

const normalizeDescription = (value: null | string) => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const detectExtension = (contentType: null | string, url: string) => {
  if (contentType) {
    if (contentType.includes("image/png")) return "png";
    if (contentType.includes("image/jpeg")) return "jpg";
    if (contentType.includes("image/webp")) return "webp";
    if (contentType.includes("image/avif")) return "avif";
    if (contentType.includes("image/svg")) return "svg";
    if (contentType.includes("image/x-icon")) return "ico";
    if (contentType.includes("image/vnd.microsoft.icon")) return "ico";
  }

  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).replace(/^\./, "");
    return ext || "bin";
  } catch {
    return "bin";
  }
};

const createAssetFileName = (
  kind: "favicon" | "thumbnail",
  key: string,
  extension: string,
) => {
  const hash = createHash("sha256").update(`${kind}:${key}`).digest("hex");
  return `${hash}.${extension}`;
};

const fetchAsset = async (
  kind: "favicon" | "thumbnail",
  assetUrl: string | undefined,
  sourceUrl: string,
): Promise<null | RemoteAsset> => {
  if (!assetUrl) {
    return null;
  }

  try {
    const response = await fetch(assetUrl);
    if (!response.ok) {
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const extension = detectExtension(
      response.headers.get("content-type"),
      assetUrl,
    );
    const assetKey =
      kind === "favicon"
        ? normalizeHost(new URL(sourceUrl).hostname)
        : assetUrl;
    const fileName = createAssetFileName(kind, assetKey, extension);
    return {
      content: buffer.toString("base64"),
      encoding: "base64",
      publicSrc: `/link-card/${fileName}`,
      repoPath: `apps/user/public/link-card/${fileName}`,
    };
  } catch {
    return null;
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

    const description =
      normalizeDescription(
        pickMetaContent(html, "property", "og:description"),
      ) ?? normalizeDescription(pickMetaContent(html, "name", "description"));
    const siteName =
      normalizeDescription(pickMetaContent(html, "property", "og:site_name")) ??
      new URL(url).hostname.replace(/^www\./, "");
    const faviconUrl =
      resolveAbsoluteUrl(pickLinkHref(html, "apple-touch-icon"), url) ??
      resolveAbsoluteUrl(pickLinkHref(html, "icon"), url) ??
      resolveAbsoluteUrl("/favicon.ico", url);
    const thumbnailUrl =
      resolveAbsoluteUrl(pickMetaContent(html, "property", "og:image"), url) ??
      resolveAbsoluteUrl(pickMetaContent(html, "name", "twitter:image"), url);

    return {
      description,
      faviconSrc: faviconUrl,
      siteName,
      thumbnailSrc: thumbnailUrl,
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

const parseMarkdownTree = (source: string) => {
  return unified().use(remarkParse).use(remarkGfm).parse(source);
};

export const createAdminLinkCardResolver = async () => {
  const manifest = await loadManifest();

  return async (url: string) => {
    const normalizedUrl = normalizeLinkCardUrl(url);
    const cached = manifest[normalizedUrl];
    if (cached) {
      return cached;
    }
    return fetchLinkCardMetadata(normalizedUrl);
  };
};

export const buildLinkCardPullRequestFiles = async (source: string) => {
  const manifest = await loadManifest();
  const tree = parseMarkdownTree(source);
  const urls = Array.from(new Set(extractStandaloneLinkUrls(tree)));
  const nextManifest: LinkCardManifest = { ...manifest };
  const filesByPath = new Map<string, PullRequestFile>();

  for (const url of urls) {
    const normalizedUrl = normalizeLinkCardUrl(url);
    if (nextManifest[normalizedUrl]) {
      continue;
    }

    const metadata = await fetchLinkCardMetadata(normalizedUrl);
    if (!metadata) {
      continue;
    }

    const faviconAsset = await fetchAsset(
      "favicon",
      metadata.faviconSrc,
      normalizedUrl,
    );
    const thumbnailAsset = await fetchAsset(
      "thumbnail",
      metadata.thumbnailSrc,
      normalizedUrl,
    );

    if (faviconAsset) {
      filesByPath.set(faviconAsset.repoPath, {
        content: faviconAsset.content,
        encoding: "base64",
        path: faviconAsset.repoPath,
      });
    }
    if (thumbnailAsset) {
      filesByPath.set(thumbnailAsset.repoPath, {
        content: thumbnailAsset.content,
        encoding: "base64",
        path: thumbnailAsset.repoPath,
      });
    }

    nextManifest[normalizedUrl] = {
      ...metadata,
      faviconSrc: faviconAsset?.publicSrc ?? metadata.faviconSrc,
      thumbnailSrc: thumbnailAsset?.publicSrc ?? metadata.thumbnailSrc,
      url: normalizedUrl,
    };
  }

  filesByPath.set("packages/content/link-cards.json", {
    content: JSON.stringify(nextManifest, null, 2) + "\n",
    encoding: "utf8",
    path: "packages/content/link-cards.json",
  });

  return Array.from(filesByPath.values());
};

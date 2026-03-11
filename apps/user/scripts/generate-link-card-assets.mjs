import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const postsDir = path.resolve(repoRoot, "packages", "content", "posts");
const timelineDir = path.resolve(repoRoot, "packages", "content", "timeline");
const manifestPath = path.resolve(
  repoRoot,
  "packages",
  "content",
  "link-cards.json",
);
const assetDir = path.resolve(repoRoot, "apps", "user", "public", "link-card");

const normalizeHost = (value) =>
  value.trim().toLowerCase().replace(/^www\./, "");

const normalizeLinkCardUrl = (rawUrl) => {
  const url = new URL(rawUrl);
  url.hash = "";
  url.search = "";
  return url.toString();
};

const resolveText = (html) =>
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

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pickMetaContent = (html, attribute, name) => {
  const pattern = new RegExp(
    `<meta[^>]+${attribute}=["']${escapeRegExp(name)}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+${attribute}=["']${escapeRegExp(name)}["'][^>]*>`,
    "i",
  );
  const match = html.match(pattern);
  return match?.[1] ?? match?.[2] ?? null;
};

const pickBaseHref = (html) =>
  html.match(/<base[^>]+href=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;

const pickTagAttribute = (tag, attributeName) =>
  tag
    .match(
      new RegExp(
        `${attributeName}=(?:"([^"]+)"|'([^']+)'|([^\\s>]+))`,
        "i",
      ),
    )
    ?.slice(1)
    .find((value) => value != null) ?? null;

const collectLinkHrefs = (html, predicate) => {
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

const collectFaviconCandidates = (html) => {
  const iconHrefs = collectLinkHrefs(html, (relValue) =>
    relValue.split(/\s+/).includes("icon"),
  );
  const appleTouchIconHrefs = collectLinkHrefs(html, (relValue) =>
    relValue
      .split(/\s+/)
      .some((token) => token.startsWith("apple-touch-icon")),
  );

  const resolvePriority = (href) => {
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

const pickTitle = (html) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1] ? resolveText(match[1]) : null;
};

const normalizeCharset = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^["']|["']$/g, "")
    .replace(/^shift-jis$/i, "shift_jis")
    .replace(/^x-sjis$/i, "shift_jis")
    .replace(/^sjis$/i, "shift_jis")
    .replace(/^utf8$/i, "utf-8");

const pickCharset = (html, contentType) => {
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

const decodeHtml = (buffer, contentType) => {
  const latin1 = buffer.toString("latin1");
  const charset = pickCharset(latin1, contentType);

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder("utf-8").decode(buffer);
  }
};

const normalizeDescription = (value) => {
  if (!value) return undefined;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const decodeHtmlEntities = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const resolveAbsoluteUrl = (value, baseUrl) => {
  if (!value) return undefined;
  try {
    return new URL(decodeHtmlEntities(value), baseUrl).toString();
  } catch {
    return undefined;
  }
};

const isHttpUrl = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isTweetUrl = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    if (
      hostname !== "twitter.com" &&
      hostname !== "x.com" &&
      !hostname.endsWith(".twitter.com") &&
      !hostname.endsWith(".x.com")
    ) {
      return false;
    }
    return /\/status\/(\d+)/.test(url.pathname);
  } catch {
    return false;
  }
};

const resolveBareUrlLine = (value) => {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }
  if (!/^https?:\/\/\S+$/u.test(trimmed)) {
    return null;
  }
  if (/[[\]()<>]/u.test(trimmed)) {
    return null;
  }
  return trimmed;
};

const extractStandaloneUrls = (source) => {
  const lines = source.split(/\r?\n/);
  const urls = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = resolveBareUrlLine(lines[index] ?? "");
    if (!current) {
      continue;
    }
    if (!isHttpUrl(current) || isTweetUrl(current)) {
      continue;
    }

    const prev = lines[index - 1];
    const next = lines[index + 1];
    const prevBlank = prev == null || prev.trim() === "";
    const nextBlank = next == null || next.trim() === "";

    if (prevBlank && nextBlank) {
      urls.push(normalizeLinkCardUrl(current));
    }
  }

  return urls;
};

const detectExtension = (contentType, url) => {
  if (contentType) {
    if (contentType.includes("image/png")) return "png";
    if (contentType.includes("image/jpeg")) return "jpg";
    if (contentType.includes("image/webp")) return "webp";
    if (contentType.includes("image/avif")) return "avif";
    if (contentType.includes("image/svg")) return "svg";
    if (contentType.includes("image/x-icon")) return "ico";
    if (contentType.includes("image/vnd.microsoft.icon")) return "ico";
    if (contentType.includes("image/gif")) return "gif";
  }

  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).replace(/^\./, "");
    return ext || "bin";
  } catch {
    return "bin";
  }
};

const createAssetFileName = (kind, key, extension) => {
  const hash = createHash("sha256").update(`${kind}:${key}`).digest("hex");
  return `${hash}.${extension}`;
};

const fetchAsset = async (kind, assetUrl, sourceUrl) => {
  if (!assetUrl) return null;

  try {
    const response = await fetch(assetUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
        Referer: sourceUrl,
        "User-Agent": "silverbirder-link-card/1.0",
      },
    });
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const extension = detectExtension(response.headers.get("content-type"), assetUrl);
    const assetKey =
      kind === "favicon"
        ? normalizeHost(new URL(sourceUrl).hostname)
        : assetUrl;
    const fileName = createAssetFileName(kind, assetKey, extension);
    await mkdir(assetDir, { recursive: true });
    await writeFile(path.join(assetDir, fileName), buffer);
    return `/link-card/${fileName}`;
  } catch {
    return null;
  }
};

const fetchLinkCardMetadata = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en-US;q=0.9,en;q=0.8",
        "User-Agent": "silverbirder-link-card/1.0",
      },
    });
    if (!response.ok) return null;

    const html = decodeHtml(
      Buffer.from(await response.arrayBuffer()),
      response.headers.get("content-type"),
    );
    const title = pickMetaContent(html, "property", "og:title") ?? pickTitle(html);
    if (!title) return null;

    const description =
      normalizeDescription(pickMetaContent(html, "property", "og:description")) ??
      normalizeDescription(pickMetaContent(html, "name", "description"));
    const siteName =
      normalizeDescription(pickMetaContent(html, "property", "og:site_name")) ??
      new URL(url).hostname.replace(/^www\./, "");
    const documentBaseUrl = resolveAbsoluteUrl(pickBaseHref(html), url) ?? url;
    const faviconCandidates = collectFaviconCandidates(html);
    const thumbnailUrl =
      resolveAbsoluteUrl(pickMetaContent(html, "property", "og:image"), url) ??
      resolveAbsoluteUrl(pickMetaContent(html, "name", "twitter:image"), url);

    let faviconSrc = null;
    for (const faviconCandidate of faviconCandidates) {
      const faviconUrl = resolveAbsoluteUrl(faviconCandidate, documentBaseUrl);
      faviconSrc = await fetchAsset("favicon", faviconUrl, url);
      if (faviconSrc) {
        break;
      }
    }
    const thumbnailSrc = await fetchAsset("thumbnail", thumbnailUrl, url);

    return {
      description,
      ...(faviconSrc ? { faviconSrc } : {}),
      siteName,
      ...(thumbnailSrc
        ? { thumbnailSrc }
        : thumbnailUrl
          ? { thumbnailSrc: thumbnailUrl }
          : {}),
      title,
      url,
    };
  } catch {
    return null;
  }
};

const loadManifest = async () => {
  try {
    const source = await readFile(manifestPath, "utf8");
    const parsed = JSON.parse(source);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const collectMarkdownSources = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const sources = await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => readFile(path.join(directory, entry.name), "utf8")),
  );
  return sources;
};

const manifest = await loadManifest();
const postSources = await collectMarkdownSources(postsDir);
const timelineSources = await collectMarkdownSources(timelineDir);
const urls = Array.from(
  new Set(
    [...postSources, ...timelineSources].flatMap((source) =>
      extractStandaloneUrls(source),
    ),
  ),
);

console.log(
  `[link-card] scanned ${postSources.length} posts, ${timelineSources.length} timeline entries, ${urls.length} unique urls`,
);

let changed = false;
let createdCount = 0;
let skippedCount = 0;
let failedCount = 0;
const failedUrls = [];

for (const [index, url] of urls.entries()) {
  const progress = `${index + 1}/${urls.length}`;
  if (manifest[url]) {
    skippedCount += 1;
    console.log(`[link-card] ${progress} skipped ${url}`);
    continue;
  }

  console.log(`[link-card] ${progress} fetching ${url}`);
  const metadata = await fetchLinkCardMetadata(url);
  if (!metadata) {
    failedCount += 1;
    failedUrls.push(url);
    console.warn(`[link-card] ${progress} failed ${url}`);
    continue;
  }
  manifest[url] = metadata;
  changed = true;
  createdCount += 1;
  console.log(`[link-card] ${progress} created ${url}`);
}

if (changed) {
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`[link-card] wrote manifest ${manifestPath}`);
}

if (!changed) {
  console.log("[link-card] manifest unchanged");
}

console.log(
  `[link-card] done created=${createdCount} skipped=${skippedCount} failed=${failedCount}`,
);

if (failedUrls.length > 0) {
  console.log("[link-card] failed urls");
  for (const failedUrl of failedUrls) {
    console.log(failedUrl);
  }
}

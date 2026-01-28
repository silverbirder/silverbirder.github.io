import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..", "..");
const contentDir = path.resolve(repoRoot, "packages", "content", "posts");
const outputDir = path.resolve(repoRoot, "apps", "user", "public");
const outputFile = path.join(outputDir, "blog-search-index.json");
const outputVersionFile = path.join(
  outputDir,
  "blog-search-index.version.json",
);

const extractFrontmatterBlock = (content) => {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }
  return match[1] ?? null;
};

const extractFrontmatterValue = (content, key) => {
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

const stripFrontmatter = (content) => {
  const match = content.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/);
  if (!match) {
    return content;
  }
  return content.slice(match[0].length);
};

const toDateValue = (publishedAt) => {
  const dateValue = Date.parse(publishedAt);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

const entries = await readdir(contentDir, { withFileTypes: true });
const slugs = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => name.endsWith(".md"))
  .map((name) => name.replace(/\.md$/, ""));

const items = await Promise.all(
  slugs.map(async (slug) => {
    const content = await readFile(path.join(contentDir, `${slug}.md`), "utf8");
    const publishedAt = extractFrontmatterValue(content, "publishedAt");
    if (!publishedAt) {
      return null;
    }
    const title = extractFrontmatterValue(content, "title") ?? slug;
    const body = stripFrontmatter(content).trim();
    return {
      body,
      dateValue: toDateValue(publishedAt),
      publishedAt,
      slug,
      title,
    };
  }),
);

const sorted = items
  .filter((item) => item !== null)
  .sort((a, b) => b.dateValue - a.dateValue)
  .map(({ body, publishedAt, slug, title }) => ({
    body,
    publishedAt,
    slug,
    title,
  }));

await mkdir(outputDir, { recursive: true });
const payload = JSON.stringify(sorted);
const version = createHash("sha256").update(payload).digest("hex").slice(0, 12);
await writeFile(outputFile, payload, "utf8");
await writeFile(
  outputVersionFile,
  JSON.stringify({ version }),
  "utf8",
);

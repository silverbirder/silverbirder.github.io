import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const contentDir = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "timeline",
);

type TimelineEntry = {
  description: string;
  publishedAt: string;
  slug: string;
  type: TimelineType;
};

export const getTimelineSlugs = async () => {
  const entries = await readdir(contentDir, { withFileTypes: true } as const);
  const slugs = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  const items = await Promise.all(
    slugs.map(async (slug) => {
      const content = await readFile(
        path.join(contentDir, `${slug}.md`),
        "utf8",
      );
      const publishedAt = extractPublishedAt(content);
      if (!publishedAt) {
        return null;
      }

      return { dateValue: toDateValue(publishedAt), publishedAt, slug };
    }),
  );

  return items
    .filter(
      (
        item,
      ): item is {
        dateValue: number;
        publishedAt: string;
        slug: string;
      } => item !== null,
    )
    .sort((a, b) => b.dateValue - a.dateValue)
    .map(({ publishedAt, slug }) => ({ publishedAt, slug }));
};

type TimelineType = "bookmark" | "share" | "tweet";

const isTimelineType = (value: string): value is TimelineType => {
  return value === "bookmark" || value === "tweet" || value === "share";
};

const extractType = (content: string): TimelineType => {
  const rawType = extractFrontmatterValue(content, "type");
  if (!rawType) {
    return "bookmark";
  }
  const normalized = rawType.toLowerCase();
  return isTimelineType(normalized) ? normalized : "bookmark";
};

export const getTimelineEntry = async (
  slug: string,
): Promise<TimelineEntry> => {
  const content = await readFile(path.join(contentDir, `${slug}.md`), "utf8");
  return {
    description: extractBody(content),
    publishedAt: extractPublishedAt(content) ?? "",
    slug,
    type: extractType(content),
  };
};

const extractFrontmatterBlock = (content: string) => {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }

  return match[1] ?? null;
};

const extractFrontmatterValue = (content: string, key: string) => {
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

const extractPublishedAt = (content: string) => {
  return (
    extractFrontmatterValue(content, "publishedAt") ??
    extractFrontmatterValue(content, "publicAt")
  );
};

const extractBody = (content: string) => {
  const match = content.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/);
  if (!match) {
    return content.trim();
  }

  return content.slice(match[0].length).trim();
};

const toDateValue = (publishedAt: string) => {
  const dateValue = Date.parse(publishedAt);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

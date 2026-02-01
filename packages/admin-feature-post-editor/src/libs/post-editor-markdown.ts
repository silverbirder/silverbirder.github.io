import { formatDate, hasFrontmatter } from "@repo/util";
import { escapeYamlSingleQuotedString, formatYamlStringList } from "@repo/util";

import { buildSummaryFromBody } from "./summary";

const formatDailyBaseName = (date: Date) => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

export const getUniqueDailyFileName = (
  existingFileNames: string[],
  date: Date,
) => {
  const base = formatDailyBaseName(date);
  const normalized = new Set(
    existingFileNames.map((name) => name.toLowerCase()),
  );
  const primary = `${base}.md`;

  if (!normalized.has(primary.toLowerCase())) {
    return primary;
  }

  for (let index = 2; index < 100; index += 1) {
    const candidate = `${base}-${index}.md`;
    if (!normalized.has(candidate.toLowerCase())) {
      return candidate;
    }
  }

  return `${base}-${Date.now()}.md`;
};

const formatTags = (tags: string[]) => formatYamlStringList(tags);

const normalizePublishedAt = (value: string, date: Date) => {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }
  return formatDate(date);
};

export const buildMarkdown = (
  draft: {
    body: string;
    index: boolean;
    publishedAt: string;
    summary: string;
    tags: string[];
    title: string;
  },
  date: Date,
) => {
  if (hasFrontmatter(draft.body)) {
    return draft.body.trimStart();
  }

  const title = escapeYamlSingleQuotedString(draft.title);
  const summary =
    draft.summary.trim().length > 0
      ? escapeYamlSingleQuotedString(draft.summary.trim())
      : escapeYamlSingleQuotedString(buildSummaryFromBody(draft.body));
  const publishedAt = normalizePublishedAt(draft.publishedAt, date);
  const body = draft.body;
  const tags = formatTags(draft.tags);

  const index = draft.index ? "true" : "false";

  return `---\ntitle: '${title}'\npublishedAt: '${publishedAt}'\nsummary: '${summary}'\ntags: ${tags}\nindex: ${index}\n---\n\n${body}\n`;
};

#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.resolve(ROOT_DIR, 'app/blog/posts');
const OUTPUT_DIR = path.resolve(ROOT_DIR, 'app/blog/notebooklm');

const YEAR_HEADER_TEMPLATE = ({ year, count }) => [
  '---',
  `year: ${year}`,
  `postCount: ${count}`,
  `generatedAt: ${new Date().toISOString()}`,
  '---',
  '',
  `# ${year} Posts`,
  ''
].join('\n');

const countBraceDiff = (line) => {
  const open = (line.match(/{/g) || []).length;
  const close = (line.match(/}/g) || []).length;
  return open - close;
};

const cleanupMdx = (content) => {
  const lines = content.split('\n');
  const result = [];
  let skippingBlock = false;
  let braceBalance = 0;

  for (const line of lines) {
    const trimmed = line.trimStart();

    if (!skippingBlock && trimmed.startsWith('export const')) {
      if (trimmed.includes('{')) {
        const hasClose = trimmed.includes('}');
        if (!hasClose) {
          skippingBlock = true;
          braceBalance = countBraceDiff(line);
          continue;
        }
        continue;
      }
      continue;
    }

    if (skippingBlock) {
      braceBalance += countBraceDiff(line);
      if (braceBalance <= 0) {
        skippingBlock = false;
      }
      continue;
    }

    if (trimmed.startsWith('import ') || trimmed.startsWith('export default ') || trimmed.startsWith('export ')) {
      continue;
    }

    result.push(line);
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
};

const parsePrimitive = (value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      // fall through to string result when JSON parsing fails
    }
  }

  if (trimmed.toLowerCase() === 'true') {
    return true;
  }

  if (trimmed.toLowerCase() === 'false') {
    return false;
  }

  if (!Number.isNaN(Number(trimmed))) {
    return Number(trimmed);
  }

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const fallbackMatter = (raw) => {
  const frontMatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontMatterMatch) {
    throw new Error('Failed to locate front matter block');
  }

  const block = frontMatterMatch[1];
  const lines = block.split('\n');
  const data = {};

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    const separatorIndex = line.indexOf(':');
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1);
    data[key] = parsePrimitive(value);
  }

  const content = raw.slice(frontMatterMatch[0].length);
  return { data, content };
};

const safeMatter = (raw) => {
  try {
    return matter(raw);
  } catch (error) {
    return fallbackMatter(raw);
  }
};

const resolveYear = (publishedAt, filename) => {
  if (typeof publishedAt === 'string') {
    const yearMatch = publishedAt.match(/\d{4}/);
    if (yearMatch) {
      return yearMatch[0];
    }
  }

  const fallbackMatch = filename.match(/\d{4}/);
  if (fallbackMatch) {
    return fallbackMatch[0];
  }

  return 'unknown';
};

const resolveDateLabel = (publishedAt, filename) => {
  if (typeof publishedAt === 'string') {
    const time = Date.parse(publishedAt);
    if (!Number.isNaN(time)) {
      return new Date(time).toISOString().slice(0, 10);
    }
    return publishedAt;
  }

  const match = filename.match(/\d{8}/);
  if (match) {
    const parts = match[0].match(/(\d{4})(\d{2})(\d{2})/);
    if (parts) {
      const [, year, month, day] = parts;
      return `${year}-${month}-${day}`;
    }
  }

  return 'unknown date';
};

const buildEntryMarkdown = ({ title, summary, tags, body, dateLabel, originalPath }) => {
  const headerLines = [];
  headerLines.push(`## ${title}`);
  headerLines.push('');
  headerLines.push(`- 発行日: ${dateLabel}`);
  headerLines.push(`- 元ファイル: ${originalPath}`);
  if (Array.isArray(tags) && tags.length > 0) {
    headerLines.push(`- タグ: ${tags.join(', ')}`);
  }
  if (typeof summary === 'string' && summary.trim().length > 0) {
    headerLines.push('');
    headerLines.push(`> ${summary.trim()}`);
  }

  const cleanedBody = cleanupMdx(body);
  if (cleanedBody.length === 0) {
    return headerLines.concat('', '---', '').join('\n');
  }

  return headerLines.concat('', cleanedBody, '', '---', '').join('\n');
};

const sortEntries = (entries) => {
  return entries.sort((a, b) => {
    const dateA = typeof a.publishedAt === 'string' ? Date.parse(a.publishedAt) : Number.NaN;
    const dateB = typeof b.publishedAt === 'string' ? Date.parse(b.publishedAt) : Number.NaN;

    if (Number.isNaN(dateA) && Number.isNaN(dateB)) {
      return a.file.localeCompare(b.file);
    }

    if (Number.isNaN(dateA)) {
      return 1;
    }

    if (Number.isNaN(dateB)) {
      return -1;
    }

    return dateA - dateB;
  });
};

const aggregate = async () => {
  const entries = await fs.readdir(SOURCE_DIR);
  const mdxFiles = entries.filter((entry) => entry.toLowerCase().endsWith('.mdx'));
  const byYear = new Map();

  for (const file of mdxFiles) {
    const absolutePath = path.join(SOURCE_DIR, file);
    const raw = await fs.readFile(absolutePath, 'utf8');
    const parsed = safeMatter(raw);
    const { data, content } = parsed;

    const publishedAt = data?.publishedAt;
    const year = resolveYear(publishedAt, file);
    const yearEntries = byYear.get(year) ?? [];
    yearEntries.push({
      file,
      title: data?.title || file.replace(/\.mdx$/i, ''),
      summary: data?.summary || '',
      tags: Array.isArray(data?.tags) ? data.tags : [],
      publishedAt,
      dateLabel: resolveDateLabel(publishedAt, file),
      originalPath: path.relative(ROOT_DIR, absolutePath),
      body: content
    });
    byYear.set(year, yearEntries);
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const [year, yearEntries] of byYear.entries()) {
    const sortedEntries = sortEntries(yearEntries);
    const header = YEAR_HEADER_TEMPLATE({ year, count: sortedEntries.length });
    const sections = sortedEntries.map((entry) => buildEntryMarkdown(entry));
    const output = [header, ...sections].join('\n').replace(/\n{3,}/g, '\n\n');
    const outputPath = path.join(OUTPUT_DIR, `${year}.md`);
    await fs.writeFile(outputPath, `${output.trim()}\n`, 'utf8');
  }
};

aggregate().catch((error) => {
  console.error('Failed to aggregate MDX posts:', error);
  process.exitCode = 1;
});

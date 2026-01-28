import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = new Set(process.argv.slice(2));

const getArgValue = (name, fallback) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
};

const usage = () => {
  // ASCII only
  console.log(
    [
      "Usage: node ./scripts/migrate/add-summary-from-body.mjs [--src <dir>] [--dest <dir>] [--file <path>] [--files <paths>] [--overwrite] [--dry-run] [--max-length <number>]",
      "",
      "Defaults:",
      "  --src        ./posts",
      "  --dest       ./posts",
      "  --max-length 120",
      "",
      "Notes:",
      "  --file can be repeated; --files is comma-separated.",
      "  File filtering matches by basename.",
    ].join("\n"),
  );
};

if (args.has("--help") || args.has("-h")) {
  usage();
  process.exit(0);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..", "..");
const projectRoot = path.resolve(process.cwd());
const defaultSrc = path.join(packageRoot, "posts");
const defaultDest = path.join(packageRoot, "posts");

const srcDir = path.resolve(getArgValue("--src", defaultSrc));
const destDir = path.resolve(getArgValue("--dest", defaultDest));

const overwrite = args.has("--overwrite");
const dryRun = args.has("--dry-run");

const maxLengthRaw = getArgValue("--max-length", "120");
const maxLength = Number(maxLengthRaw);

if (!Number.isFinite(maxLength) || maxLength <= 0) {
  console.error(`Invalid --max-length value: ${maxLengthRaw}`);
  process.exit(1);
}

const collectFileArgs = () => {
  const values = [];

  for (let i = 0; i < process.argv.length; i += 1) {
    const arg = process.argv[i];

    if (arg === "--file") {
      const next = process.argv[i + 1];
      if (next) values.push(next);
    } else if (arg.startsWith("--file=")) {
      values.push(arg.slice("--file=".length));
    } else if (arg === "--files") {
      const next = process.argv[i + 1];
      if (next) values.push(...next.split(","));
    } else if (arg.startsWith("--files=")) {
      values.push(...arg.slice("--files=".length).split(","));
    }
  }

  return values.filter(Boolean);
};

const normalizeTargetName = (name) => {
  const baseName = path.basename(name);
  if (baseName.endsWith(".mdx")) {
    return baseName.replace(/\.mdx$/, ".md");
  }
  return baseName;
};

const targetNames = new Set(collectFileArgs().map(normalizeTargetName));
const hasTargets = targetNames.size > 0;

const isDirectory = async (dir) => {
  try {
    const result = await stat(dir);
    return result.isDirectory();
  } catch {
    return false;
  }
};

if (!(await isDirectory(srcDir))) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}

await mkdir(destDir, { recursive: true });

const entries = await readdir(srcDir, { withFileTypes: true });
const markdownFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
  .map((entry) => entry.name)
  .sort();

const filteredFiles = hasTargets
  ? markdownFiles.filter((name) => targetNames.has(name))
  : markdownFiles;

if (filteredFiles.length === 0) {
  if (hasTargets) {
    console.log("No matching .md files found.");
  } else {
    console.log("No .md files found.");
  }
  process.exit(0);
}

const parseFrontmatter = (content) => {
  const lines = content.split(/\r?\n/);
  if (lines.length === 0 || lines[0].trim() !== "---") {
    return null;
  }

  let endIndex = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === "---") {
      endIndex = i;
      break;
    }
  }

  if (endIndex === -1) {
    return null;
  }

  return {
    frontmatterLines: lines.slice(1, endIndex),
    bodyLines: lines.slice(endIndex + 1),
  };
};

const isSummaryLine = (line) => line.trimStart().startsWith("summary:");

const summaryValueFromLine = (line) => {
  const index = line.indexOf("summary:");
  if (index === -1) return "";
  return line.slice(index + "summary:".length).trim();
};

const isEmptySummaryValue = (value) => {
  if (value === "") return true;
  const trimmed = value.trim();
  if (trimmed === "") return true;
  if (trimmed === "''" || trimmed === '""') return true;
  if (trimmed.startsWith("|") || trimmed.startsWith(">")) return false;
  const withoutQuotes = trimmed.replace(/^['"]|['"]$/g, "").trim();
  return withoutQuotes === "";
};

const stripMarkdown = (body) => {
  const source = body.replace(/<!--[\s\S]*?-->/g, "");
  const lines = source.split(/\r?\n/);
  const output = [];
  let inFence = false;

  for (const line of lines) {
    if (line.startsWith("```") || line.startsWith("~~~")) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    if (/^\s*\[[^\]]+\]:\s+\S+/.test(line)) {
      continue;
    }

    if (/^\s*(?:\|?\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line)) {
      continue;
    }

    if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
      continue;
    }

    let next = line;
    next = next.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");
    next = next.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    next = next.replace(/\[([^\]]+)\]\[[^\]]+\]/g, "$1");
    next = next.replace(/`([^`]+)`/g, "$1");
    next = next.replace(/\*\*([^*]+)\*\*/g, "$1");
    next = next.replace(/\*([^*]+)\*/g, "$1");
    next = next.replace(/__([^_]+)__/g, "$1");
    next = next.replace(/_([^_]+)_/g, "$1");
    next = next.replace(/~~([^~]+)~~/g, "$1");
    next = next.replace(/<[^>]+>/g, "");
    next = next.replace(/^>+\s?/, "");
    next = next.replace(/^\s*(?:[-*+]|\d+\.)\s+/, "");
    next = next.replace(/^\s*#{1,6}\s+/, "");
    next = next.replace(/\s+/g, " ").trim();

    if (next) {
      output.push(next);
    }
  }

  return output.join(" ").replace(/\s+/g, " ").trim();
};

const toSummary = (body, limit) => {
  const plain = stripMarkdown(body);
  if (!plain) return "";
  if (plain.length <= limit) return plain;
  return plain.slice(0, limit).trim();
};

const escapeSummary = (value) => value.replace(/'/g, "''");

const insertOrUpdateSummary = (content) => {
  const parsed = parseFrontmatter(content);
  if (!parsed) return { content, changed: false, skippedReason: "no-frontmatter" };

  const { frontmatterLines, bodyLines } = parsed;
  let summaryIndex = -1;
  let summaryValue = "";

  for (let i = 0; i < frontmatterLines.length; i += 1) {
    const line = frontmatterLines[i];
    if (isSummaryLine(line)) {
      summaryIndex = i;
      summaryValue = summaryValueFromLine(line);
      break;
    }
  }

  const hasSummary = summaryIndex !== -1;
  const needsSummary = !hasSummary || isEmptySummaryValue(summaryValue);

  if (!needsSummary) {
    return { content, changed: false };
  }

  const body = bodyLines.join("\n");
  const summaryText = toSummary(body, maxLength);
  if (!summaryText) {
    return { content, changed: false, skippedReason: "empty-body" };
  }

  const escaped = escapeSummary(summaryText);
  const summaryLine = `summary: '${escaped}'`;

  if (hasSummary) {
    frontmatterLines[summaryIndex] = summaryLine;
  } else {
    const publishedAtIndex = frontmatterLines.findIndex((line) =>
      line.trimStart().startsWith("publishedAt:"),
    );
    const titleIndex = frontmatterLines.findIndex((line) =>
      line.trimStart().startsWith("title:"),
    );
    const insertIndex =
      publishedAtIndex !== -1
        ? publishedAtIndex + 1
        : titleIndex !== -1
          ? titleIndex + 1
          : frontmatterLines.length;
    frontmatterLines.splice(insertIndex, 0, summaryLine);
  }

  const nextContent = ["---", ...frontmatterLines, "---", ...bodyLines].join("\n");
  return { content: nextContent, changed: true };
};

let updated = 0;
let skipped = 0;

for (const fileName of filteredFiles) {
  const srcPath = path.join(srcDir, fileName);
  const destPath = path.join(destDir, fileName);

  if (!overwrite && srcPath !== destPath) {
    try {
      await stat(destPath);
      console.log(`Skip (exists): ${path.relative(projectRoot, destPath)}`);
      skipped += 1;
      continue;
    } catch {
      // continue
    }
  }

  if (await isDirectory(destPath)) {
    console.log(`Skip (directory): ${path.relative(projectRoot, destPath)}`);
    skipped += 1;
    continue;
  }

  const content = await readFile(srcPath, "utf8");
  const result = insertOrUpdateSummary(content);

  if (result.skippedReason === "no-frontmatter") {
    console.log(`Skip (no frontmatter): ${path.relative(projectRoot, srcPath)}`);
    skipped += 1;
    continue;
  }

  if (result.skippedReason === "empty-body") {
    console.log(`Skip (empty body): ${path.relative(projectRoot, srcPath)}`);
    skipped += 1;
    continue;
  }

  if (!result.changed && srcPath === destPath) {
    console.log(`No change: ${path.relative(projectRoot, srcPath)}`);
    continue;
  }

  if (dryRun) {
    console.log(`Would write: ${path.relative(projectRoot, destPath)}`);
    updated += 1;
    continue;
  }

  await writeFile(destPath, result.content, "utf8");
  console.log(`Wrote: ${path.relative(projectRoot, destPath)}`);
  updated += 1;
}

console.log(`Done. updated=${updated} skipped=${skipped}`);

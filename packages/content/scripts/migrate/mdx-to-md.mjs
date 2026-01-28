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
      "Usage: node ./scripts/migrate/mdx-to-md.mjs [--src <dir>] [--dest <dir>] [--file <path>] [--files <paths>] [--overwrite] [--dry-run]",
      "",
      "Defaults:",
      "  --src  ./posts/tmp",
      "  --dest ./posts",
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
const defaultSrc = path.join(packageRoot, "posts", "tmp");
const defaultDest = path.join(packageRoot, "posts");

const srcDir = path.resolve(getArgValue("--src", defaultSrc));
const destDir = path.resolve(getArgValue("--dest", defaultDest));

const overwrite = args.has("--overwrite");
const dryRun = args.has("--dry-run");

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
  if (baseName.endsWith(".md")) {
    return baseName.replace(/\.md$/, ".mdx");
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
const mdxFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
  .map((entry) => entry.name)
  .sort();

const filteredFiles = hasTargets
  ? mdxFiles.filter((name) => targetNames.has(name))
  : mdxFiles;

if (filteredFiles.length === 0) {
  if (hasTargets) {
    console.log("No matching .mdx files found.");
  } else {
    console.log("No .mdx files found.");
  }
  process.exit(0);
}

let converted = 0;
let skipped = 0;

for (const fileName of filteredFiles) {
  const srcPath = path.join(srcDir, fileName);
  const destName = fileName.replace(/\.mdx$/, ".md");
  const destPath = path.join(destDir, destName);

  if (!overwrite) {
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

  if (dryRun) {
    console.log(`Would write: ${path.relative(projectRoot, destPath)}`);
    converted += 1;
    continue;
  }

  const content = await readFile(srcPath, "utf8");
  await writeFile(destPath, content, "utf8");
  console.log(`Wrote: ${path.relative(projectRoot, destPath)}`);
  converted += 1;
}

console.log(`Done. converted=${converted} skipped=${skipped}`);

import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGET_DIRECTORIES = ["posts", "timeline"];
const MARKDOWN_EXTENSION = ".md";
const VERSION_SEGMENT_PATTERN = /^v\d+$/;
const GIF_URL_PATTERN =
  /https?:\/\/res\.cloudinary\.com\/[^\s)"']+\/image\/upload\/[^\s)"']+\.gif(?:\?[^\s)"']*)?/g;

const packageRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = packageRoot;

const collectMarkdownFiles = async (directoryPath) => {
  const entries = await readdir(directoryPath, { withFileTypes: true });

  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectMarkdownFiles(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith(MARKDOWN_EXTENSION)) {
        return [entryPath];
      }

      return [];
    }),
  );

  return files.flat();
};

const parseCloudinaryUploadUrl = (value) => {
  let url;

  try {
    url = new URL(value);
  } catch {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 4) {
    return null;
  }

  const [, resourceType, deliveryType, ...rest] = segments;
  if (resourceType !== "image" || deliveryType !== "upload") {
    return null;
  }

  const versionIndex = rest.findIndex((segment) =>
    VERSION_SEGMENT_PATTERN.test(segment),
  );
  if (versionIndex < 0) {
    return null;
  }

  const assetPath = rest.slice(versionIndex).join("/");
  const cloudName = segments[0];
  const baseUrl = `${url.protocol}//${url.host}/${cloudName}/image/upload`;

  return {
    assetPath,
    baseUrl,
    searchParams: url.searchParams,
  };
};

const buildNotebookImageUrl = ({
  assetPath,
  baseUrl,
  height,
  searchParams,
  width,
}) => {
  const url = new URL(`${baseUrl}/${assetPath}`);

  for (const [key, value] of searchParams.entries()) {
    if (key === "ar") {
      continue;
    }

    url.searchParams.append(key, value);
  }

  url.searchParams.set("ar", `${width}:${height}`);

  return url.href;
};

const buildCacheKey = ({ assetPath, baseUrl }) => `${baseUrl}/${assetPath}`;

const formatProgress = ({ completed, total }) => {
  if (total === 0) {
    return "0.0";
  }

  return ((completed / total) * 100).toFixed(1);
};

const parseGifSize = (buffer, url) => {
  const signature = buffer.subarray(0, 6).toString("ascii");
  if (signature !== "GIF87a" && signature !== "GIF89a") {
    throw new Error(`Invalid GIF header: ${url}`);
  }

  const width = buffer.readUInt16LE(6);
  const height = buffer.readUInt16LE(8);

  if (width <= 0 || height <= 0) {
    throw new Error(`Invalid GIF size: ${url}`);
  }

  return {
    height,
    width,
  };
};

const fetchGifSize = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch GIF: ${response.status} ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.length < 10) {
    throw new Error(`GIF response too small: ${url}`);
  }

  return parseGifSize(buffer, url);
};

const replaceGifUrls = async (source, sizeCache) => {
  const matches = source.match(GIF_URL_PATTERN);
  if (!matches) {
    return {
      changed: false,
      nextSource: source,
      replacements: 0,
    };
  }

  const uniqueMatches = [...new Set(matches)];
  let nextSource = source;
  let replacements = 0;

  for (const match of uniqueMatches) {
    const parsed = parseCloudinaryUploadUrl(match);
    if (!parsed) {
      continue;
    }

    const cacheKey = buildCacheKey(parsed);
    let size = sizeCache.get(cacheKey);
    if (!size) {
      try {
        size = await fetchGifSize(`${parsed.baseUrl}/${parsed.assetPath}`);
        sizeCache.set(cacheKey, size);
      } catch (error) {
        console.warn(
          `Skipped ${match}: ${error instanceof Error ? error.message : String(error)}`,
        );
        continue;
      }
    }

    const replacement = buildNotebookImageUrl({
      assetPath: parsed.assetPath,
      baseUrl: parsed.baseUrl,
      height: size.height,
      searchParams: parsed.searchParams,
      width: size.width,
    });

    if (replacement === match) {
      continue;
    }

    nextSource = nextSource.split(match).join(replacement);
    replacements += 1;
  }

  return {
    changed: nextSource !== source,
    nextSource,
    replacements,
  };
};

const migrateFile = async (filePath, sizeCache) => {
  const source = await readFile(filePath, "utf8");
  const result = await replaceGifUrls(source, sizeCache);

  if (!result.changed) {
    return {
      changed: false,
      replacements: 0,
    };
  }

  await writeFile(filePath, result.nextSource);

  return {
    changed: true,
    replacements: result.replacements,
  };
};

const main = async () => {
  const markdownFiles = (
    await Promise.all(
      TARGET_DIRECTORIES.map((directory) =>
        collectMarkdownFiles(path.join(contentRoot, directory)),
      ),
    )
  ).flat();

  const sizeCache = new Map();
  let changedFiles = 0;
  let replacementCount = 0;
  const totalFiles = markdownFiles.length;

  for (const [index, filePath] of markdownFiles.entries()) {
    const result = await migrateFile(filePath, sizeCache);
    const relativePath = path.relative(contentRoot, filePath);

    if (result.changed) {
      changedFiles += 1;
      replacementCount += result.replacements;
      console.log(
        `[${formatProgress({ completed: index + 1, total: totalFiles })}%] ${index + 1}/${totalFiles} ${relativePath}: replaced ${result.replacements} image URL(s)`,
      );
      continue;
    }

    console.log(
      `[${formatProgress({ completed: index + 1, total: totalFiles })}%] ${index + 1}/${totalFiles} ${relativePath}: no changes`,
    );
  }

  console.log(
    `Updated ${changedFiles} file(s), replaced ${replacementCount} image URL(s).`,
  );
};

await main();

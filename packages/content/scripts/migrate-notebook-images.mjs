import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGET_DIRECTORIES = ["posts", "timeline"];
const MARKDOWN_EXTENSION = ".md";
const CLOUDINARY_IMAGE_UPLOAD_SEGMENT = "/image/upload/";
const VERSION_SEGMENT_PATTERN = /^v\d+$/;
const IMAGE_URL_PATTERN =
  /https?:\/\/res\.cloudinary\.com\/[^\s)"']+\/image\/upload\/[^\s)"']+/g;

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

const buildGetInfoUrl = ({ assetPath, baseUrl }) =>
  `${baseUrl}/fl_getinfo/${assetPath}`;

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

const parseSvgDimension = (value) => {
  const match = value.match(/^\s*([0-9]+(?:\.[0-9]+)?)/);
  if (!match?.[1]) {
    return null;
  }

  const dimension = Number.parseFloat(match[1]);
  return Number.isFinite(dimension) && dimension > 0 ? dimension : null;
};

const parseSvgSize = (source, url) => {
  const widthMatch = source.match(/\bwidth="([^"]+)"/i);
  const heightMatch = source.match(/\bheight="([^"]+)"/i);
  const width = widthMatch?.[1] ? parseSvgDimension(widthMatch[1]) : null;
  const height = heightMatch?.[1] ? parseSvgDimension(heightMatch[1]) : null;

  if (width && height) {
    return {
      height,
      width,
    };
  }

  const viewBoxMatch = source.match(/\bviewBox="([^"]+)"/i);
  if (!viewBoxMatch?.[1]) {
    throw new Error(`SVG size could not be parsed: ${url}`);
  }

  const values = viewBoxMatch[1]
    .trim()
    .split(/[\s,]+/)
    .map((value) => Number.parseFloat(value));

  if (
    values.length !== 4 ||
    values.some((value) => !Number.isFinite(value)) ||
    values[2] <= 0 ||
    values[3] <= 0
  ) {
    throw new Error(`Invalid SVG viewBox: ${url}`);
  }

  return {
    height: values[3],
    width: values[2],
  };
};

const fetchImageSize = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image info: ${response.status} ${url}`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const data = await response.json();
    const width = data?.input?.width;
    const height = data?.input?.height;

    if (
      typeof width !== "number" ||
      typeof height !== "number" ||
      width <= 0 ||
      height <= 0
    ) {
      throw new Error(`Invalid image info response: ${url}`);
    }

    return {
      height,
      width,
    };
  }

  if (contentType.includes("image/svg+xml") || url.endsWith(".svg")) {
    return parseSvgSize(await response.text(), url);
  }

  throw new Error(`Unsupported image info content type: ${contentType} ${url}`);
};

const replaceImageUrls = async (source, sizeCache) => {
  const matches = source.match(IMAGE_URL_PATTERN);
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
        size = await fetchImageSize(buildGetInfoUrl(parsed));
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
  const result = await replaceImageUrls(source, sizeCache);

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
  let processedFiles = 0;

  for (const filePath of markdownFiles) {
    const result = await migrateFile(filePath, sizeCache);
    processedFiles += 1;
    const progress = formatProgress({
      completed: processedFiles,
      total: totalFiles,
    });
    const relativePath = path.relative(contentRoot, filePath);

    if (!result.changed) {
      console.log(
        `[${progress}%] ${processedFiles}/${totalFiles} ${relativePath}: no changes`,
      );
      continue;
    }

    changedFiles += 1;
    replacementCount += result.replacements;
    console.log(
      `[${progress}%] ${processedFiles}/${totalFiles} ${relativePath}: replaced ${result.replacements} image URL(s)`,
    );
  }

  console.log(
    `Updated ${changedFiles} file(s), replaced ${replacementCount} image URL(s).`,
  );
};

await main();

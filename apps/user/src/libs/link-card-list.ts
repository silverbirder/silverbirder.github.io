import type { LinkCardMetadata } from "@repo/util";

import { readFile } from "node:fs/promises";
import path from "node:path";

type LinkCardManifest = Record<string, LinkCardMetadata>;

const manifestPath = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "content",
  "link-cards.json",
);

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

export const listLinkCards = async (): Promise<LinkCardMetadata[]> => {
  const manifest = await loadManifest();

  return Object.values(manifest).sort((a, b) => {
    const left = a.title.trim().toLowerCase();
    const right = b.title.trim().toLowerCase();
    return left.localeCompare(right, "ja");
  });
};

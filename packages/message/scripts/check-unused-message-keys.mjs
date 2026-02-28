import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const messagePath = path.join(repoRoot, "packages/message/ja.json");
const shouldFix = process.argv.includes("--fix");

const flattenMessageKeys = (value, prefix = "") => {
  if (typeof value === "string") {
    return prefix ? [prefix] : [];
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return [];
  }

  const entries = [];
  for (const [key, child] of Object.entries(value)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    entries.push(...flattenMessageKeys(child, nextPrefix));
  }
  return entries;
};

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isPossibleMessageKey = (value) =>
  /^[A-Za-z0-9_.-]+$/.test(value) && !value.startsWith(".") && !value.endsWith(".");
const extractCallExpressionSource = (source, openParenIndex) => {
  let depth = 0;
  let inDouble = false;
  let inSingle = false;
  let inTemplate = false;
  let isEscaped = false;

  for (let index = openParenIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inDouble || inSingle || inTemplate) {
      if (isEscaped) {
        isEscaped = false;
        continue;
      }
      if (char === "\\") {
        isEscaped = true;
        continue;
      }
      if (inDouble && char === "\"") {
        inDouble = false;
        continue;
      }
      if (inSingle && char === "'") {
        inSingle = false;
        continue;
      }
      if (inTemplate && char === "`") {
        inTemplate = false;
      }
      continue;
    }

    if (char === "\"") {
      inDouble = true;
      continue;
    }
    if (char === "'") {
      inSingle = true;
      continue;
    }
    if (char === "`") {
      inTemplate = true;
      continue;
    }
    if (char === "(") {
      depth += 1;
      continue;
    }
    if (char === ")") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openParenIndex + 1, index);
      }
    }
  }

  return "";
};
const removeKeyByPath = (target, pathParts) => {
  if (pathParts.length === 0) {
    return;
  }

  const [head, ...rest] = pathParts;
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    return;
  }

  if (rest.length === 0) {
    delete target[head];
    return;
  }

  const child = target[head];
  if (!child || typeof child !== "object" || Array.isArray(child)) {
    return;
  }

  removeKeyByPath(child, rest);

  if (Object.keys(child).length === 0) {
    delete target[head];
  }
};

const fileListRaw = execSync(
  [
    "rg --files apps packages",
    "-g '*.ts'",
    "-g '*.tsx'",
    "-g '*.js'",
    "-g '*.jsx'",
    "-g '!**/node_modules/**'",
    "-g '!**/.next/**'",
    "-g '!**/dist/**'",
    "-g '!**/coverage/**'",
  ].join(" "),
  { cwd: repoRoot, encoding: "utf8" },
);

const files = fileListRaw
  .split("\n")
  .map((file) => file.trim())
  .filter(Boolean);

const messages = JSON.parse(readFileSync(messagePath, "utf8"));
const messageKeys = flattenMessageKeys(messages);
const usedKeys = new Set();

for (const file of files) {
  const fullPath = path.join(repoRoot, file);
  const source = readFileSync(fullPath, "utf8");

  const translators = [];
  const translatorRegex =
    /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

  for (const match of source.matchAll(translatorRegex)) {
    translators.push({ name: match[1], namespace: match[2] });
  }

  for (const { name, namespace } of translators) {
    const callStartRegex = new RegExp(
      `${escapeForRegExp(name)}(?:\\.(?:rich|markup|raw|has))?\\(`,
      "g",
    );

    for (const match of source.matchAll(callStartRegex)) {
      const openParenIndex = match.index + match[0].length - 1;
      const callSource = extractCallExpressionSource(source, openParenIndex);
      if (!callSource) {
        continue;
      }

      const literalRegex = /["'`]([^"'`]+)["'`]/g;
      for (const literal of callSource.matchAll(literalRegex)) {
        const key = literal[1];
        if (!isPossibleMessageKey(key)) {
          continue;
        }
        const fullKey = key.startsWith(`${namespace}.`)
          ? key
          : `${namespace}.${key}`;
        usedKeys.add(fullKey);
      }
    }
  }
}

const unusedKeys = messageKeys.filter((key) => !usedKeys.has(key)).sort();

if (unusedKeys.length === 0) {
  console.log("No unused message keys found in packages/message/ja.json");
  process.exit(0);
}

if (shouldFix) {
  for (const key of unusedKeys) {
    removeKeyByPath(messages, key.split("."));
  }
  writeFileSync(messagePath, `${JSON.stringify(messages, null, 2)}\n`);
  console.log("Removed unused message keys from packages/message/ja.json:");
  for (const key of unusedKeys) {
    console.log(`- ${key}`);
  }
  process.exit(0);
}

console.error("Unused message keys found in packages/message/ja.json:");
for (const key of unusedKeys) {
  console.error(`- ${key}`);
}
process.exit(1);

const DEFAULT_SUMMARY_MAX_LENGTH = 120;

const stripFrontmatter = (content: string) =>
  content.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, "");

const stripMarkdown = (body: string) => {
  const source = stripFrontmatter(body).replace(/<!--[\s\S]*?-->/g, "");
  const lines = source.split(/\r?\n/);
  const output: string[] = [];
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

export const buildSummaryFromBody = (
  body: string,
  maxLength: number = DEFAULT_SUMMARY_MAX_LENGTH,
) => {
  const plain = stripMarkdown(body);
  if (!plain) {
    return "";
  }
  if (plain.length <= maxLength) {
    return plain;
  }
  return plain.slice(0, maxLength).trim();
};

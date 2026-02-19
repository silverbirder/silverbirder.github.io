import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

const LINK_FETCH_TIMEOUT_MS = 4000;
const LINK_FETCH_CONCURRENCY = 4;
const MAX_LINK_FETCH = 20;

const USER_AGENT = "AdminLinkResolver/1.0";

const isHttpUrl = (rawUrl: string) => {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const decodeHtmlEntities = (value: string) => {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]+);/g,
    (match, key: string) => {
      if (typeof key !== "string") {
        return match;
      }

      if (key.startsWith("#x") || key.startsWith("#X")) {
        const codePoint = Number.parseInt(key.slice(2), 16);
        return Number.isFinite(codePoint)
          ? String.fromCodePoint(codePoint)
          : match;
      }

      if (key.startsWith("#")) {
        const codePoint = Number.parseInt(key.slice(1), 10);
        return Number.isFinite(codePoint)
          ? String.fromCodePoint(codePoint)
          : match;
      }

      return Object.prototype.hasOwnProperty.call(named, key)
        ? named[key]!
        : match;
    },
  );
};

const normalizeTitle = (title: string) => {
  const normalized = title.replace(/\s+/g, " ");
  return normalized.length > 0 ? normalized : null;
};

const extractHtmlTitle = (html: string) => {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (!match) {
    return null;
  }

  const raw = match[1] ?? "";
  return normalizeTitle(decodeHtmlEntities(raw));
};

const fetchHtmlTitle = async (url: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LINK_FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "user-agent": USER_AGENT,
      },
      redirect: "follow",
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return extractHtmlTitle(html);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const resolveDocumentTitle = async (url: string) => {
  return fetchHtmlTitle(url);
};

const runWithConcurrency = async <Input, Output>(
  items: Input[],
  limit: number,
  task: (item: Input) => Promise<Output>,
) => {
  if (items.length === 0) {
    return [];
  }

  const results: Output[] = new Array(items.length);
  let index = 0;

  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (index < items.length) {
        const currentIndex = index;
        index += 1;
        const item = items[currentIndex];
        if (item === undefined) {
          continue;
        }
        results[currentIndex] = await task(item);
      }
    },
  );

  await Promise.all(workers);
  return results;
};

type LinkCandidate = {
  node: LinkNode;
  url: string;
};

type LinkChild = {
  type?: string;
  value?: string;
};

type LinkNode = UnistNode & {
  children?: LinkChild[];
  type: "link";
  url: string;
};

type TitleEntry = readonly [string, string];

type UnistNode = {
  [key: string]: unknown;
  type?: string;
};

const createRemarkLinkTitlePlugin = () => {
  return async (tree: unknown) => {
    const linkCandidates: LinkCandidate[] = [];
    visit(tree as Parameters<typeof visit>[0], "link", (node: LinkNode) => {
      const url = typeof node?.url === "string" ? node.url : null;
      if (!url || !isHttpUrl(url)) {
        return;
      }
      if (
        Array.isArray(node?.children) &&
        node.children.some((child: LinkChild) => child?.type === "image")
      ) {
        return;
      }
      linkCandidates.push({ node, url });
    });

    if (linkCandidates.length === 0) {
      return;
    }

    const uniqueUrls = Array.from(
      new Set(linkCandidates.map((candidate) => candidate.url)),
    ).slice(0, MAX_LINK_FETCH);

    const titles = await runWithConcurrency<string, null | TitleEntry>(
      uniqueUrls,
      LINK_FETCH_CONCURRENCY,
      async (url) => {
        const title = await resolveDocumentTitle(url);
        return title ? ([url, title] as const) : null;
      },
    );

    const replacementMap = new Map<string, string>();
    for (const entry of titles) {
      if (!entry) {
        continue;
      }
      const [url, title] = entry;
      const hostname = new URL(url).hostname;
      replacementMap.set(url, `${title} - ${hostname}`);
    }

    if (replacementMap.size === 0) {
      return;
    }

    for (const candidate of linkCandidates) {
      const replacement = replacementMap.get(candidate.url);
      if (!replacement) {
        continue;
      }
      candidate.node.children = [{ type: "text", value: replacement }];
    }
  };
};

const resolveLinkTitlesInMarkdown = async (source: string) => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(createRemarkLinkTitlePlugin)
    .use(remarkStringify, {
      bullet: "-",
      // Keep hard breaks serialized as trailing spaces to avoid adding "\".
      handlers: {
        break() {
          return "  \n";
        },
      },
    })
    .process(source);

  return String(file);
};

export const resolveLinkTitles = async (source: string) => {
  "use server";
  return resolveLinkTitlesInMarkdown(source);
};

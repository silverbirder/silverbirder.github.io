import { visit } from "unist-util-visit";

type LinkNode = UnistNode & {
  children?: UnistNode[];
  type: "link";
  url: string;
};

type UnistNode = {
  [key: string]: unknown;
  children?: UnistNode[];
  type?: string;
  url?: string;
  value?: string;
};

const isTwitterStatusUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    const hostname = url.hostname.replace(/^www\./, "");
    if (
      hostname !== "twitter.com" &&
      hostname !== "x.com" &&
      !hostname.endsWith(".twitter.com") &&
      !hostname.endsWith(".x.com")
    ) {
      return false;
    }
    return /\/status\/(\d+)/.test(url.pathname);
  } catch {
    return false;
  }
};

const resolveTextValue = (node: LinkNode) => {
  if (!Array.isArray(node.children)) {
    return null;
  }
  const chunks = node.children
    .filter(
      (child) => child?.type === "text" && typeof child.value === "string",
    )
    .map((child) => String(child.value));
  if (chunks.length === 0) {
    return null;
  }
  return chunks.join("");
};

const replaceLinkText = (node: LinkNode, value: string) => {
  node.children = [{ type: "text", value }];
};

export const createRemarkLinkCardGuard = () => {
  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], "link", (node: LinkNode) => {
      const url = typeof node?.url === "string" ? node.url : null;
      if (!url || !isTwitterStatusUrl(url)) {
        return;
      }
      const text = resolveTextValue(node);
      if (!text || text !== url) {
        return;
      }
      replaceLinkText(node, "tweet");
    });
  };
};

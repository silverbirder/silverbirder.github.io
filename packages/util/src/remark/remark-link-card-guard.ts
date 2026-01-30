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

const normalizeHost = (rawHost: string) =>
  rawHost
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");

const ignoredLinkCardHosts = [
  "3tene.com",
  "apps.apple.com",
  "cloudnativedays.jp",
  "community.cloudflare.com",
  "developer.apple.com",
  "developer.mozilla.org",
  "dev.tiqav.com",
  "firebase.google.com",
  "it.srad.jp",
  "jestjs.io",
  "jp.techcrunch.com",
  "lh7-us.googleusercontent.com",
  "material-ui.com",
  "medium.com",
  "my-buy-items.vercel.app",
  "speakerdeck.com",
  "stackblitz.com",
  "support.cloudflare.com",
  "trends.google.co.jp",
  "www.apps-gcp.com",
  "www.arlo.com",
  "www.brita.co.jp",
  "www.bynorth.com",
  "www.cg-method.com",
  "www.excite.co.jp",
  "www.gitpod.io",
  "www.kickstarter.com",
  "www.meta.com",
  "www.muji.com",
  "www.nikko-pc.com",
  "www.nitori-net.jp",
  "www.npmjs.com",
  "www.publickey1.jp",
  "www.reddit.com",
  "www.redhat.com",
  "www.satofull.jp",
  "www.st-hakky-blog.com",
  "www.switchbot.jp",
  "www.wasdkeyboards.com",
  "yahoo-osaka.connpass.com",
].map(normalizeHost);

const normalizeUrl = (rawUrl: string) => {
  try {
    return new URL(rawUrl).toString();
  } catch {
    return null;
  }
};

const isHttpUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const createRemarkLinkCardGuard = () => {
  const shouldIgnoreLinkCard = (rawUrl: string) => {
    const normalizedUrl = normalizeUrl(rawUrl);
    if (!normalizedUrl) {
      return false;
    }
    try {
      const url = new URL(normalizedUrl);
      const host = normalizeHost(url.hostname);
      return ignoredLinkCardHosts.some(
        (ignored) => host === ignored || host.endsWith(`.${ignored}`),
      );
    } catch {
      return false;
    }
  };

  return (tree: unknown) => {
    visit(tree as Parameters<typeof visit>[0], "link", (node: LinkNode) => {
      const url = typeof node?.url === "string" ? node.url : null;
      if (!url) {
        return;
      }
      const text = resolveTextValue(node);
      if (!text || text !== url) {
        return;
      }
      if (isTwitterStatusUrl(url)) {
        replaceLinkText(node, "tweet");
        return;
      }
      if (shouldIgnoreLinkCard(url)) {
        replaceLinkText(node, normalizeHost(new URL(url).hostname));
      }
    });

    visit(
      tree as Parameters<typeof visit>[0],
      "text",
      (node: UnistNode, index, parent) => {
        if (typeof node.value !== "string") {
          return;
        }
        if (!isHttpUrl(node.value) || !shouldIgnoreLinkCard(node.value)) {
          return;
        }
        const parentNode = parent as undefined | UnistNode;
        if (!parentNode || parentNode.type !== "paragraph") {
          return;
        }
        if (
          !Array.isArray(parentNode.children) ||
          parentNode.children.length !== 1
        ) {
          return;
        }
        if (typeof index !== "number") {
          return;
        }
        const host = normalizeHost(new URL(node.value).hostname);
        parentNode.children.splice(index, 1, {
          children: [{ type: "text", value: host }],
          type: "link",
          url: node.value,
        });
      },
    );
  };
};

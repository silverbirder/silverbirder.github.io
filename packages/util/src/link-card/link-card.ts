import { visit } from "unist-util-visit";

type CreateRemarkLinkCardOptions = {
  resolveCard?: LinkCardResolver;
};

type LinkCardMetadata = {
  description?: string;
  faviconSrc?: string;
  siteName?: string;
  thumbnailSrc?: string;
  title: string;
  url: string;
};

type LinkCardResolver = (
  url: string,
) => LinkCardMetadata | null | Promise<LinkCardMetadata | null>;

type LinkNode = {
  children?: UnistNode[];
  type: "link";
  url: string;
};

type MdxAttribute = {
  name: string;
  type: "mdxJsxAttribute";
  value: MdxAttributeValue;
};

type MdxAttributeValue = null | string;

type ParagraphNode = {
  children?: UnistNode[];
  data?: Record<string, unknown>;
  position?: {
    end?: { offset?: number };
    start?: { offset?: number };
  };
  type: "paragraph";
};

type ParentNode = {
  children?: UnistNode[];
  type?: string;
};

type UnistNode = {
  attributes?: unknown[];
  children?: UnistNode[];
  data?: Record<string, unknown>;
  name?: string;
  type?: string;
  url?: string;
  value?: string;
};

const normalizeHost = (rawHost: string) =>
  rawHost
    .trim()
    .toLowerCase()
    .replace(/^www\./, "");

export const normalizeLinkCardUrl = (rawUrl: string) => {
  const url = new URL(rawUrl);
  url.hash = "";
  url.search = "";
  return url.toString();
};

const ignoredHosts = [
  "codepen.io",
  "cucumber.io",
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

const isHttpUrl = (rawUrl: string) => {
  try {
    const url = new URL(rawUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isTweetUrl = (rawUrl: string) => {
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

const shouldIgnoreLinkCard = (rawUrl: string) => {
  try {
    const url = new URL(normalizeLinkCardUrl(rawUrl));
    const host = normalizeHost(url.hostname);
    return ignoredHosts.some(
      (ignoredHost) => host === ignoredHost || host.endsWith(`.${ignoredHost}`),
    );
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

const isSingleLinkParagraph = (node: ParagraphNode) => {
  if (!Array.isArray(node.children) || node.children.length !== 1) {
    return false;
  }
  return node.children[0]?.type === "link";
};

const resolveRawParagraph = (
  node: ParagraphNode,
  source: string | undefined,
): null | string => {
  if (!source) {
    return null;
  }

  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;
  if (typeof start !== "number" || typeof end !== "number") {
    return null;
  }

  return source.slice(start, end).trim();
};

const createAttribute = (
  name: string,
  value: MdxAttributeValue,
): MdxAttribute => ({
  name,
  type: "mdxJsxAttribute",
  value,
});

const createLinkCardNode = (card: LinkCardMetadata): UnistNode => ({
  attributes: [
    createAttribute("url", card.url),
    createAttribute("title", card.title),
    createAttribute("description", card.description ?? null),
    createAttribute("siteName", card.siteName ?? null),
    createAttribute("faviconSrc", card.faviconSrc ?? null),
    createAttribute("thumbnailSrc", card.thumbnailSrc ?? null),
  ],
  children: [],
  data: {
    _mdxExplicitJsx: true,
  },
  name: "LinkCard",
  type: "mdxJsxFlowElement",
});

const resolveLinkCardCandidate = (node: ParagraphNode, source?: string) => {
  if (!isSingleLinkParagraph(node)) {
    return null;
  }

  const linkNode = node.children?.[0] as LinkNode | undefined;
  const url = typeof linkNode?.url === "string" ? linkNode.url : null;
  if (!linkNode || !url || !isHttpUrl(url)) {
    return null;
  }

  const text = resolveTextValue(linkNode);
  if (text !== url) {
    return null;
  }

  const rawParagraph = resolveRawParagraph(node, source);
  if (rawParagraph !== null && rawParagraph !== url) {
    return null;
  }

  if (isTweetUrl(url) || shouldIgnoreLinkCard(url)) {
    return null;
  }

  return normalizeLinkCardUrl(url);
};

export const extractStandaloneLinkUrls = (tree: unknown, source?: string) => {
  const urls: string[] = [];
  visit(
    tree as Parameters<typeof visit>[0],
    "paragraph",
    (node: ParagraphNode, _index, parent) => {
      const parentNode = parent as ParentNode | undefined;
      if (parentNode?.type !== "root") {
        return;
      }
      const url = resolveLinkCardCandidate(node, source);
      if (url) {
        urls.push(url);
      }
    },
  );
  return urls;
};

export const createRemarkLinkCard = ({
  resolveCard,
}: CreateRemarkLinkCardOptions = {}) => {
  return async (tree: unknown, file?: { value?: unknown }) => {
    const source = typeof file?.value === "string" ? file.value : undefined;
    const replacements: Array<{
      card: LinkCardMetadata;
      index: number;
      parent: ParentNode;
    }> = [];

    const visits: Promise<void>[] = [];
    visit(
      tree as Parameters<typeof visit>[0],
      "paragraph",
      (node: ParagraphNode, index, parent) => {
        if (typeof index !== "number") {
          return;
        }
        const parentNode = parent as ParentNode | undefined;
        if (!parentNode || !Array.isArray(parentNode.children)) {
          return;
        }
        if (parentNode.type !== "root") {
          return;
        }

        const url = resolveLinkCardCandidate(node, source);
        if (!url) {
          return;
        }

        visits.push(
          Promise.resolve(resolveCard?.(url)).then((card) => {
            if (!card) {
              return;
            }
            replacements.push({
              card: {
                ...card,
                url,
              },
              index,
              parent: parentNode,
            });
          }),
        );
      },
    );

    await Promise.all(visits);

    for (const replacement of replacements) {
      replacement.parent.children?.splice(
        replacement.index,
        1,
        createLinkCardNode(replacement.card),
      );
    }
  };
};

export type { LinkCardMetadata };

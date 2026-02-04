import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const REQUIRED_ENV = [
  "DISQUS_API_KEY",
  "DISQUS_FORUM",
  "SLACK_WEBHOOK_URL",
  "SITE_BASE_URL",
];

const getEnv = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

const env = Object.fromEntries(REQUIRED_ENV.map((key) => [key, getEnv(key)]));

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "packages", "content", "posts");
const stateDir = path.join(rootDir, ".github", ".cache");
const statePath = path.join(stateDir, "disqus-reactions-state.json");

const apiBase = "https://disqus.com/api/3.0";

const ensureTrailingSlash = (value) =>
  value.endsWith("/") ? value : `${value}/`;

const siteBaseUrl = ensureTrailingSlash(env.SITE_BASE_URL);

const normalizeTitle = (raw) => {
  if (!raw) return "";
  const trimmed = raw.trim();
  return trimmed.replace(/^['"]|['"]$/g, "");
};

const parseFrontmatterTitle = (source) => {
  if (!source.startsWith("---")) return "";
  const endIndex = source.indexOf("\n---", 3);
  if (endIndex === -1) return "";
  const frontmatter = source.slice(3, endIndex);
  const match = frontmatter.match(/^title:\s*(.+)$/m);
  return normalizeTitle(match?.[1] ?? "");
};

const toPostUrl = (slug) => {
  const pathname = `blog/contents/${slug}/`;
  return new URL(pathname, siteBaseUrl).toString();
};

const apiGet = async (endpoint, params) => {
  const url = new URL(`${apiBase}/${endpoint}`);
  url.searchParams.set("api_key", env.DISQUS_API_KEY);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Disqus API error (${res.status}): ${await res.text()}`);
  }
  return res.json();
};

const loadState = async () => {
  try {
    const data = await readFile(statePath, "utf8");
    return JSON.parse(data);
  } catch {
    return { threads: {} };
  }
};

const saveState = async (state) => {
  await mkdir(stateDir, { recursive: true });
  await writeFile(statePath, JSON.stringify(state, null, 2));
};

const extractReactions = (payload) => {
  const response = payload?.response;
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.reactions)) return response.reactions;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const normalizeReaction = (reaction) => {
  const count =
    reaction?.count ??
    reaction?.votes ??
    reaction?.total ??
    reaction?.numVotes ??
    0;
  const label =
    reaction?.title ??
    reaction?.label ??
    reaction?.name ??
    reaction?.code ??
    "reaction";
  return {
    id: String(reaction?.id ?? label),
    label: String(label),
    count: Number(count) || 0,
  };
};

const formatDelta = (delta) => (delta > 0 ? `+${delta}` : `${delta}`);

const sendSlack = async (lines) => {
  const text = lines.join("\n");
  const payload = {
    text,
  };
  const res = await fetch(env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook error (${res.status}): ${await res.text()}`);
  }
};

const main = async () => {
  const files = await readdir(contentDir);
  const slugs = files
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));

  const prevState = await loadState();
  const nextState = { threads: {} };
  const changes = [];

  for (const slug of slugs) {
    const source = await readFile(path.join(contentDir, `${slug}.md`), "utf8");
    const title = parseFrontmatterTitle(source) || slug;
    const url = toPostUrl(slug);

    let threadId = "";
    try {
      const details = await apiGet("threads/details.json", {
        forum: env.DISQUS_FORUM,
        "thread:link": url,
      });
      threadId = details?.response?.id ?? "";
    } catch (error) {
      console.error(`[warn] threads/details failed for ${url}`, error);
      continue;
    }

    if (!threadId) {
      continue;
    }

    let reactions = [];
    try {
      const reactionsPayload = await apiGet(
        "threadReactions/loadReactions.json",
        {
          thread: threadId,
        },
      );
      reactions = extractReactions(reactionsPayload).map(normalizeReaction);
    } catch (error) {
      console.error(`[warn] loadReactions failed for ${url}`, error);
      continue;
    }

    const reactionMap = Object.fromEntries(
      reactions.map((reaction) => [reaction.id, reaction]),
    );

    nextState.threads[threadId] = {
      url,
      title,
      reactions: Object.fromEntries(
        reactions.map((reaction) => [reaction.id, reaction.count]),
      ),
      reactionLabels: Object.fromEntries(
        reactions.map((reaction) => [reaction.id, reaction.label]),
      ),
      updatedAt: new Date().toISOString(),
    };

    const prevThread = prevState.threads?.[threadId];
    if (!prevThread) {
      continue;
    }

    const prevReactions = prevThread.reactions ?? {};
    for (const reaction of reactions) {
      const prevCount = Number(prevReactions[reaction.id] ?? 0);
      const delta = reaction.count - prevCount;
      if (delta > 0) {
        changes.push({
          title,
          url,
          label: reactionMap[reaction.id]?.label ?? reaction.label,
          delta,
          total: reaction.count,
        });
      }
    }
  }

  await saveState(nextState);

  if (changes.length === 0) {
    console.log("No reaction changes detected.");
    return;
  }

  const header = `Disqus reactions update (${changes.length} changes)`;
  const lines = [
    header,
    ...changes.slice(0, 50).map((change) => {
      const label = change.label ? ` ${change.label}` : "";
      return `• ${change.title}${label} ${formatDelta(
        change.delta,
      )} (total ${change.total}) ${change.url}`;
    }),
  ];

  if (changes.length > 50) {
    lines.push(`…and ${changes.length - 50} more`);
  }

  await sendSlack(lines);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

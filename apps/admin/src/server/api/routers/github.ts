import { TRPCError } from "@trpc/server";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Octokit } from "octokit";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { auth } from "@/server/better-auth";

type GitHubContentItem = {
  name: string;
  path: string;
  type: "dir" | "file";
};

const defaultPostsPath = "packages/content/posts";

const parseRepository = (repository: string) => {
  const [owner, repo, ...rest] = repository.split("/");
  if (!owner || !repo || rest.length > 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid CONTENT_GITHUB_REPOSITORY format.",
    });
  }
  return { owner, repo };
};

const normalizeMarkdownFileName = (fileName: string) => {
  if (fileName.includes("/") || fileName.includes("\\")) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "fileName must not contain path separators.",
    });
  }
  return fileName.toLowerCase().endsWith(".md") ? fileName : `${fileName}.md`;
};

const buildBranchName = (fileName: string) => {
  const base = fileName.replace(/\.md$/i, "");
  const safe = base
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "");
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  return `content/${safe || "post"}-${timestamp}`;
};

const extractFrontmatterBlock = (content: string) => {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
};

const extractFrontmatterValue = (frontmatter: string, key: string) => {
  const line = frontmatter
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}:`));
  if (!line) {
    return null;
  }

  const rawValue = line.replace(new RegExp(`^\\s*${key}:\\s*`), "");
  const raw = rawValue.replace(/^\s+|\s+$/g, "");
  if (raw === "") {
    return null;
  }

  const quote = raw.charAt(0);
  if ((quote === "'" || quote === '"') && raw.endsWith(quote)) {
    return raw.slice(1, -1);
  }

  return raw;
};

const parseTags = (value: null | string) => {
  if (!value) {
    return [];
  }

  const trimmed = value.replace(/^\s+|\s+$/g, "");
  if (!trimmed) {
    return [];
  }

  const normalized =
    trimmed.startsWith("[") && trimmed.endsWith("]")
      ? trimmed.slice(1, -1)
      : trimmed;

  const tags = normalized
    .split(",")
    .map((tag) => {
      const cleaned = tag.replace(/^\s+|\s+$/g, "");
      return cleaned.replace(/^['"]+|['"]+$/g, "").replace(/^\s+|\s+$/g, "");
    })
    .filter((tag) => tag.length > 0);

  return tags;
};

const extractTagsFromFrontmatter = (frontmatter: string) => {
  return parseTags(extractFrontmatterValue(frontmatter, "tags"));
};

const extractPublishedAtFromContent = (content: string) => {
  const frontmatter = extractFrontmatterBlock(content);
  if (!frontmatter) {
    return null;
  }
  return extractFrontmatterValue(frontmatter, "publishedAt");
};

const extractTitleFromContent = (content: string) => {
  const frontmatter = extractFrontmatterBlock(content);
  if (!frontmatter) {
    return null;
  }
  return extractFrontmatterValue(frontmatter, "title");
};

const extractSummaryFromContent = (content: string) => {
  const frontmatter = extractFrontmatterBlock(content);
  if (!frontmatter) {
    return null;
  }
  return extractFrontmatterValue(frontmatter, "summary");
};

const extractTagsFromContent = (content: string) => {
  const frontmatter = extractFrontmatterBlock(content);
  if (!frontmatter) {
    return [];
  }
  return extractTagsFromFrontmatter(frontmatter);
};

const stripFrontmatter = (content: string) => {
  const match = content.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/);
  if (!match) {
    return content;
  }
  let body = content.slice(match[0].length);
  if (body.startsWith("\r\n")) {
    body = body.slice(2);
  } else if (body.startsWith("\n")) {
    body = body.slice(1);
  }
  return body;
};

const buildDraftFromContent = (content: string) => {
  return {
    body: stripFrontmatter(content),
    publishedAt: extractPublishedAtFromContent(content) ?? "",
    summary: extractSummaryFromContent(content) ?? "",
    tags: extractTagsFromContent(content),
    title: extractTitleFromContent(content) ?? "",
  };
};

const toDateValue = (publishedAt: string) => {
  const dateValue = Date.parse(publishedAt);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

const decodeGithubContent = (payload: {
  content?: string;
  encoding?: string;
}) => {
  if (!payload.content || payload.encoding !== "base64") {
    return null;
  }
  return Buffer.from(payload.content, "base64").toString("utf8");
};

const chunkArray = <T>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const getRepositoryConfig = () => {
  const { owner, repo } = parseRepository(env.CONTENT_GITHUB_REPOSITORY);
  return {
    baseBranch: env.CONTENT_GITHUB_BASE_BRANCH,
    owner,
    postsPath: env.CONTENT_POSTS_PATH || defaultPostsPath,
    repo,
  };
};

const resolveLocalPostsPath = async (postsPath: string) => {
  const candidates = [
    path.resolve(process.cwd(), postsPath),
    path.resolve(process.cwd(), "..", "..", postsPath),
  ];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  return null;
};

const getLocalPostList = async (postsPath: string) => {
  const resolvedPath = await resolveLocalPostsPath(postsPath);
  if (!resolvedPath) {
    return null;
  }

  const entries = await readdir(resolvedPath, {
    withFileTypes: true,
  } as const);
  const fileNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md"));

  const posts = await Promise.all(
    fileNames.map(async (fileName) => {
      try {
        const content = await readFile(
          path.join(resolvedPath, fileName),
          "utf8",
        );
        const publishedAt = extractPublishedAtFromContent(content);
        const dateValue = publishedAt ? toDateValue(publishedAt) : 0;
        return { dateValue, name: fileName };
      } catch {
        return { dateValue: 0, name: fileName };
      }
    }),
  );

  return posts
    .sort((left, right) => {
      if (right.dateValue !== left.dateValue) {
        return right.dateValue - left.dateValue;
      }
      return left.name.localeCompare(right.name);
    })
    .map(({ name }) => name);
};

const getLocalTagList = async (postsPath: string) => {
  const resolvedPath = await resolveLocalPostsPath(postsPath);
  if (!resolvedPath) {
    return null;
  }

  const entries = await readdir(resolvedPath, {
    withFileTypes: true,
  } as const);
  const fileNames = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith(".md"));

  const tags = new Set<string>();
  const contents = await Promise.all(
    fileNames.map(async (fileName) => {
      try {
        return await readFile(path.join(resolvedPath, fileName), "utf8");
      } catch {
        return null;
      }
    }),
  );

  for (const content of contents) {
    if (!content) {
      continue;
    }
    const extracted = extractTagsFromContent(content);
    for (const tag of extracted) {
      tags.add(tag);
    }
  }

  return Array.from(tags).sort((left, right) => left.localeCompare(right));
};

const getLocalPost = async (postsPath: string, fileName: string) => {
  const resolvedPath = await resolveLocalPostsPath(postsPath);
  if (!resolvedPath) {
    return null;
  }

  try {
    const content = await readFile(path.join(resolvedPath, fileName), "utf8");
    return content;
  } catch {
    return null;
  }
};

export const githubRouter = createTRPCRouter({
  createPullRequest: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        fileName: z.string().min(1),
        pullRequestBody: z.string().optional(),
        pullRequestTitle: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { baseBranch, owner, postsPath, repo } = getRepositoryConfig();
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "github",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const octokit = new Octokit({ auth: accessToken });
      const normalizedFileName = normalizeMarkdownFileName(input.fileName);
      const branchName = buildBranchName(normalizedFileName);

      const baseRefResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/git/ref/{ref}",
        {
          owner,
          ref: `heads/${baseBranch}`,
          repo,
        },
      );

      const baseSha = (baseRefResponse.data as { object?: { sha?: string } })
        .object?.sha;
      if (!baseSha) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to resolve base branch SHA.",
        });
      }

      await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
        owner,
        ref: `refs/heads/${branchName}`,
        repo,
        sha: baseSha,
      });

      const filePath = `${postsPath}/${normalizedFileName}`;
      const commitMessage = `docs: add ${normalizedFileName}`;

      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        branch: branchName,
        content: Buffer.from(input.content, "utf8").toString("base64"),
        message: commitMessage,
        owner,
        path: filePath,
        repo,
      });

      const prTitle = input.pullRequestTitle
        ? input.pullRequestTitle
        : `docs: add ${normalizedFileName}`;
      const prResponse = await octokit.request(
        "POST /repos/{owner}/{repo}/pulls",
        {
          base: baseBranch,
          body: input.pullRequestBody,
          head: branchName,
          owner,
          repo,
          title: prTitle,
        },
      );

      const prData = prResponse.data as { html_url?: string; number?: number };

      return {
        branchName,
        filePath,
        number: prData.number ?? null,
        url: prData.html_url ?? null,
      };
    }),

  getPost: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { owner, postsPath, repo } = getRepositoryConfig();
      const normalizedFileName = normalizeMarkdownFileName(input.slug);
      const localContent = await getLocalPost(postsPath, normalizedFileName);
      if (localContent) {
        return buildDraftFromContent(localContent);
      }

      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "github",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const octokit = new Octokit({ auth: accessToken });
      const filePath = `${postsPath}/${normalizedFileName}`;
      const response = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          path: filePath,
          repo,
        },
      );

      if (Array.isArray(response.data)) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const payload = response.data as {
        content?: string;
        encoding?: string;
      };
      const content = decodeGithubContent(payload);
      if (!content) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return buildDraftFromContent(content);
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const { owner, postsPath, repo } = getRepositoryConfig();
    const localPosts = await getLocalPostList(postsPath);
    if (localPosts) {
      return localPosts;
    }

    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: "github",
      },
      headers: ctx.headers,
    });

    if (!accessToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const octokit = new Octokit({ auth: accessToken });
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        path: postsPath,
        repo,
      },
    );

    const data = response.data as GitHubContentItem[];
    if (!Array.isArray(data)) {
      return [];
    }

    const fileNames = data
      .filter((item) => item.type === "file" && item.name.endsWith(".md"))
      .map((item) => item.name);

    const chunks = chunkArray(fileNames, 10);
    const posts: { dateValue: number; name: string }[] = [];

    for (const chunk of chunks) {
      const contents = await Promise.all(
        chunk.map(async (fileName) => {
          try {
            const filePath = `${postsPath}/${fileName}`;
            const fileResponse = await octokit.request(
              "GET /repos/{owner}/{repo}/contents/{path}",
              {
                owner,
                path: filePath,
                repo,
              },
            );
            if (Array.isArray(fileResponse.data)) {
              return { fileName, publishedAt: null };
            }
            const payload = fileResponse.data as {
              content?: string;
              encoding?: string;
            };
            const content = decodeGithubContent(payload);
            const publishedAt = content
              ? extractPublishedAtFromContent(content)
              : null;
            return { fileName, publishedAt };
          } catch {
            return { fileName, publishedAt: null };
          }
        }),
      );

      for (const { fileName, publishedAt } of contents) {
        if (!publishedAt) {
          posts.push({ dateValue: 0, name: fileName });
          continue;
        }
        posts.push({ dateValue: toDateValue(publishedAt), name: fileName });
      }
    }

    return posts
      .sort((left, right) => {
        if (right.dateValue !== left.dateValue) {
          return right.dateValue - left.dateValue;
        }
        return left.name.localeCompare(right.name);
      })
      .map(({ name }) => name);
  }),

  listTags: protectedProcedure.query(async ({ ctx }) => {
    const { owner, postsPath, repo } = getRepositoryConfig();
    const localTags = await getLocalTagList(postsPath);
    if (localTags) {
      return localTags;
    }

    const { accessToken } = await auth.api.getAccessToken({
      body: {
        providerId: "github",
      },
      headers: ctx.headers,
    });

    if (!accessToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const octokit = new Octokit({ auth: accessToken });
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        path: postsPath,
        repo,
      },
    );

    const data = response.data as GitHubContentItem[];
    if (!Array.isArray(data)) {
      return [];
    }

    const fileNames = data
      .filter((item) => item.type === "file" && item.name.endsWith(".md"))
      .map((item) => item.name);

    const tags = new Set<string>();
    const chunks = chunkArray(fileNames, 10);

    for (const chunk of chunks) {
      const contents = await Promise.all(
        chunk.map(async (fileName) => {
          try {
            const filePath = `${postsPath}/${fileName}`;
            const fileResponse = await octokit.request(
              "GET /repos/{owner}/{repo}/contents/{path}",
              {
                owner,
                path: filePath,
                repo,
              },
            );
            if (Array.isArray(fileResponse.data)) {
              return null;
            }
            const payload = fileResponse.data as {
              content?: string;
              encoding?: string;
            };
            return decodeGithubContent(payload);
          } catch {
            return null;
          }
        }),
      );

      for (const content of contents) {
        if (!content) {
          continue;
        }
        const extracted = extractTagsFromContent(content);
        for (const tag of extracted) {
          tags.add(tag);
        }
      }
    }

    return Array.from(tags).sort((left, right) => left.localeCompare(right));
  }),

  updatePullRequest: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        fileName: z.string().min(1),
        pullRequestBody: z.string().optional(),
        pullRequestTitle: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { baseBranch, owner, postsPath, repo } = getRepositoryConfig();
      const { accessToken } = await auth.api.getAccessToken({
        body: {
          providerId: "github",
        },
        headers: ctx.headers,
      });

      if (!accessToken) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const octokit = new Octokit({ auth: accessToken });
      const normalizedFileName = normalizeMarkdownFileName(input.fileName);
      const branchName = buildBranchName(normalizedFileName);

      const baseRefResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/git/ref/{ref}",
        {
          owner,
          ref: `heads/${baseBranch}`,
          repo,
        },
      );

      const baseSha = (baseRefResponse.data as { object?: { sha?: string } })
        .object?.sha;
      if (!baseSha) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to resolve base branch SHA.",
        });
      }

      await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
        owner,
        ref: `refs/heads/${branchName}`,
        repo,
        sha: baseSha,
      });

      const filePath = `${postsPath}/${normalizedFileName}`;
      const existingResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          path: filePath,
          ref: baseBranch,
          repo,
        },
      );

      const existingData = existingResponse.data as { sha?: string };
      const fileSha = existingData.sha;
      if (!fileSha) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found.",
        });
      }

      const commitMessage = `docs: update ${normalizedFileName}`;

      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        branch: branchName,
        content: Buffer.from(input.content, "utf8").toString("base64"),
        message: commitMessage,
        owner,
        path: filePath,
        repo,
        sha: fileSha,
      });

      const prTitle = input.pullRequestTitle
        ? input.pullRequestTitle
        : `docs: update ${normalizedFileName}`;
      const prResponse = await octokit.request(
        "POST /repos/{owner}/{repo}/pulls",
        {
          base: baseBranch,
          body: input.pullRequestBody,
          head: branchName,
          owner,
          repo,
          title: prTitle,
        },
      );

      const prData = prResponse.data as { html_url?: string; number?: number };

      return {
        branchName,
        filePath,
        number: prData.number ?? null,
        url: prData.html_url ?? null,
      };
    }),
});

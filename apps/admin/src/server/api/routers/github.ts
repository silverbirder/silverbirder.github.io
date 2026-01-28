import { TRPCError } from "@trpc/server";
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

const getRepositoryConfig = () => {
  const { owner, repo } = parseRepository(env.CONTENT_GITHUB_REPOSITORY);
  return {
    baseBranch: env.CONTENT_GITHUB_BASE_BRANCH,
    owner,
    postsPath: env.CONTENT_POSTS_PATH || defaultPostsPath,
    repo,
  };
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

  list: protectedProcedure.query(async ({ ctx }) => {
    const { owner, postsPath, repo } = getRepositoryConfig();
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

    return data
      .filter((item) => item.type === "file" && item.name.endsWith(".md"))
      .map((item) => item.name)
      .sort((left, right) => left.localeCompare(right));
  }),
});

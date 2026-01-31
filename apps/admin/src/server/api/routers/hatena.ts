import { TRPCError } from "@trpc/server";
import { Octokit } from "octokit";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { auth } from "@/server/better-auth";

type PullRequestInfo = {
  head?: {
    ref?: string;
  };
  html_url?: string;
  number?: number;
  title?: string;
};

const parseRepository = (repository: string) => {
  const [owner, repo, ...rest] = repository.split("/");
  if (!owner || !repo || rest.length > 0) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Invalid HATENA_GITHUB_REPOSITORY format.",
    });
  }
  return { owner, repo };
};

const getRepositoryConfig = () => {
  const { owner, repo } = parseRepository(env.HATENA_GITHUB_REPOSITORY);
  return {
    baseBranch: env.HATENA_GITHUB_BASE_BRANCH,
    draftEntriesPath: "draft_entries",
    owner,
    repo,
  };
};

const splitFrontmatter = (source: string) => {
  const trimmed = source.replace(/^\uFEFF/, "");
  const match = trimmed.match(/^---\n[\s\S]*?\n---\n?/);
  if (!match) {
    return { body: trimmed, frontmatter: "" };
  }
  const frontmatter = match[0].trimEnd();
  const body = trimmed.slice(match[0].length);
  return { body, frontmatter };
};

const extractTitleToken = (title: string) => title.trim().toLowerCase();

const findDraftPullRequest = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  title: string,
) => {
  const token = extractTitleToken(title);
  if (token.length === 0) {
    return null;
  }
  const response = await octokit.request("GET /repos/{owner}/{repo}/pulls", {
    direction: "desc",
    owner,
    per_page: 10,
    repo,
    sort: "created",
    state: "open",
  });
  const pullRequests = response.data as PullRequestInfo[];
  return (
    pullRequests.find((pullRequest) =>
      pullRequest.title?.toLowerCase().includes(token),
    ) ?? null
  );
};

const listMarkdownInDrafts = async (
  octokit: Octokit,
  owner: string,
  repo: string,
  draftEntriesPath: string,
  ref: string,
) => {
  const response = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner,
      path: draftEntriesPath,
      ref,
      repo,
    },
  );
  const items = Array.isArray(response.data) ? response.data : [];
  const markdown = items.find(
    (item) => item.type === "file" && item.name?.endsWith(".md"),
  );
  return markdown?.path ?? null;
};

const buildPullRequestListUrl = (owner: string, repo: string) =>
  `https://github.com/${owner}/${repo}/pulls`;

export const hatenaRouter = createTRPCRouter({
  createPullRequest: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        title: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { baseBranch, draftEntriesPath, owner, repo } =
        getRepositoryConfig();
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

      await octokit.request(
        "POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches",
        {
          inputs: {
            title: input.title,
          },
          owner,
          ref: baseBranch,
          repo,
          workflow_id: "create-draft.yaml",
        },
      );

      const pullRequest = await findDraftPullRequest(
        octokit,
        owner,
        repo,
        input.title,
      );

      const fallbackUrl = buildPullRequestListUrl(owner, repo);
      const branchName = pullRequest?.head?.ref ?? null;
      const prUrl = pullRequest?.html_url ?? fallbackUrl;

      if (!pullRequest || !branchName) {
        return {
          branchName,
          filePath: null,
          number: pullRequest?.number ?? null,
          url: prUrl,
        };
      }

      const filePath = await listMarkdownInDrafts(
        octokit,
        owner,
        repo,
        draftEntriesPath,
        branchName,
      );

      if (!filePath) {
        return {
          branchName,
          filePath: null,
          number: pullRequest.number ?? null,
          url: prUrl,
        };
      }

      const fileResponse = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
          owner,
          path: filePath,
          ref: branchName,
          repo,
        },
      );

      const fileData = fileResponse.data as {
        content?: string;
        encoding?: string;
        sha?: string;
      };

      if (!fileData.content || !fileData.sha) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to load draft content.",
        });
      }

      const encoding: BufferEncoding =
        fileData.encoding === "base64" ? "base64" : "base64";
      const existing = Buffer.from(fileData.content, encoding).toString("utf8");
      const existingSplit = splitFrontmatter(existing);
      const inputSplit = splitFrontmatter(input.content);
      const draftBody = inputSplit.body.trimStart();
      const nextContent =
        existingSplit.frontmatter.length > 0
          ? `${existingSplit.frontmatter}\n\n${draftBody}`
          : input.content;
      const commitMessage = `docs: update ${filePath}`;

      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        branch: branchName,
        content: Buffer.from(nextContent, "utf8").toString("base64"),
        message: commitMessage,
        owner,
        path: filePath,
        repo,
        sha: fileData.sha,
      });

      return {
        branchName,
        filePath,
        number: pullRequest.number ?? null,
        url: prUrl,
      };
    }),
});

import { createHash } from "node:crypto";

export const COMMENT_MAX_LENGTH = 255;

type CreateCommentBody = {
  anonId?: string;
  body?: string;
  slug?: string;
};

type DeleteCommentBody = {
  anonId?: string;
  commentId?: number;
};

export const normalizeSlug = (value: string) => value.toLowerCase();

const parseOrigins = (value: string | undefined) => {
  if (!value) return [];
  return value.split(",").filter(Boolean);
};

export const resolveCorsOrigin = (origin: null | string) => {
  if (!origin) return null;
  const allowedOrigins = parseOrigins(process.env.ALLOWED_ORIGINS);
  if (allowedOrigins.length === 0) {
    return origin;
  }
  return allowedOrigins.includes(origin) ? origin : null;
};

export const buildCorsHeaders = (origin: null | string) => {
  const resolvedOrigin = resolveCorsOrigin(origin);
  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Origin": resolvedOrigin ?? "",
    Vary: "Origin",
  } as const;
};

export const hashAnonId = (anonId: string) => {
  return createHash("sha256").update(anonId).digest("hex");
};

const parseString = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value;
};

export const parseCreateCommentBody = (
  body: unknown,
): { data: CreateCommentBody } | { error: string } => {
  if (!body || typeof body !== "object") {
    return { error: "request body must be an object" };
  }

  const data = body as Record<string, unknown>;
  const slug = parseString(data.slug);
  const anonId = parseString(data.anonId);
  const commentBody = parseString(data.body);

  if (!slug || !anonId || !commentBody) {
    return { error: "slug, anonId and body are required" };
  }

  if (commentBody.length > COMMENT_MAX_LENGTH) {
    return { error: `body must be at most ${COMMENT_MAX_LENGTH} characters` };
  }

  return {
    data: {
      anonId,
      body: commentBody,
      slug: normalizeSlug(slug),
    },
  };
};

export const parseDeleteCommentBody = (
  body: unknown,
): { data: DeleteCommentBody } | { error: string } => {
  if (!body || typeof body !== "object") {
    return { error: "request body must be an object" };
  }

  const data = body as Record<string, unknown>;
  const anonId = parseString(data.anonId);
  const commentIdRaw = data.commentId;
  const commentId =
    typeof commentIdRaw === "number"
      ? commentIdRaw
      : typeof commentIdRaw === "string"
        ? Number.parseInt(commentIdRaw, 10)
        : Number.NaN;

  if (!anonId || Number.isNaN(commentId) || commentId <= 0) {
    return { error: "anonId and commentId are required" };
  }

  return {
    data: {
      anonId,
      commentId,
    },
  };
};

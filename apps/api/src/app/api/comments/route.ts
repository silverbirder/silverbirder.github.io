import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { comments } from "@/db/schema";

import {
  buildCorsHeaders,
  hashAnonId,
  normalizeSlug,
  parseCreateCommentBody,
  parseDeleteCommentBody,
  resolveCorsOrigin,
} from "./logic";

export const runtime = "nodejs";

const buildPostUrl = (origin: null | string, slug: string) => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    origin?.replace(/\/$/, "") ??
    "";
  if (!base) return "";
  return `${base}/blog/contents/${slug}/`;
};

const notifySlack = async (payload: {
  action: "comment_add" | "comment_delete";
  body?: string;
  slug: string;
  url?: string;
}) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL is not set.");
    return;
  }

  const bodySuffix = payload.body ? `\n${payload.body}` : "";
  const urlSuffix = payload.url ? `\n${payload.url}` : "";
  const text = `:speech_balloon: ${payload.action} ${payload.slug}${bodySuffix}${urlSuffix}`;

  try {
    const response = await fetch(webhookUrl, {
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) {
      const body = await response.text();
      console.error("Slack webhook failed", response.status, body);
    }
  } catch (error) {
    console.error("Slack webhook failed", error);
  }
};

const mapComment = (
  comment: {
    authorAnonIdHash: string;
    body: string;
    createdAt: Date;
    id: number;
  },
  currentAnonIdHash: null | string,
) => {
  return {
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    id: comment.id,
    mine:
      typeof currentAnonIdHash === "string" &&
      comment.authorAnonIdHash === currentAnonIdHash,
  };
};

export async function DELETE(request: Request) {
  const origin = request.headers.get("origin");
  const corsOrigin = resolveCorsOrigin(origin);

  if (origin && !corsOrigin) {
    return NextResponse.json(
      { error: "origin is not allowed" },
      { headers: buildCorsHeaders(origin), status: 403 },
    );
  }

  const rawBody = (await request.json().catch(() => null)) as unknown;
  const parsed = parseDeleteCommentBody(rawBody);

  if ("error" in parsed) {
    return NextResponse.json(
      { error: parsed.error },
      { headers: buildCorsHeaders(origin), status: 400 },
    );
  }

  const anonIdHash = hashAnonId(parsed.data.anonId ?? "");
  const existing = await db
    .select({
      authorAnonIdHash: comments.authorAnonIdHash,
      body: comments.body,
      id: comments.id,
      slug: comments.slug,
    })
    .from(comments)
    .where(eq(comments.id, parsed.data.commentId ?? -1))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json(
      { error: "comment not found" },
      { headers: buildCorsHeaders(origin), status: 404 },
    );
  }

  if (existing[0]?.authorAnonIdHash !== anonIdHash) {
    return NextResponse.json(
      { error: "cannot delete this comment" },
      { headers: buildCorsHeaders(origin), status: 403 },
    );
  }

  await db
    .delete(comments)
    .where(
      and(
        eq(comments.id, parsed.data.commentId ?? -1),
        eq(comments.authorAnonIdHash, anonIdHash),
      ),
    );

  try {
    await notifySlack({
      action: "comment_delete",
      body: existing[0]?.body,
      slug: existing[0]?.slug ?? "",
      url: existing[0]?.slug ? buildPostUrl(origin, existing[0].slug) : "",
    });
  } catch (error) {
    console.error("Slack notification failed", error);
  }

  return NextResponse.json({ ok: true }, { headers: buildCorsHeaders(origin) });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const anonId = searchParams.get("anonId");
  const origin = request.headers.get("origin");
  const corsOrigin = resolveCorsOrigin(origin);

  if (origin && !corsOrigin) {
    return NextResponse.json(
      { error: "origin is not allowed" },
      { headers: buildCorsHeaders(origin), status: 403 },
    );
  }

  if (!slug) {
    return NextResponse.json(
      { error: "slug is required" },
      { headers: buildCorsHeaders(origin), status: 400 },
    );
  }

  const normalizedSlug = normalizeSlug(slug);
  const currentAnonIdHash = anonId ? hashAnonId(anonId) : null;
  const rows = await db
    .select({
      authorAnonIdHash: comments.authorAnonIdHash,
      body: comments.body,
      createdAt: comments.createdAt,
      id: comments.id,
    })
    .from(comments)
    .where(eq(comments.slug, normalizedSlug))
    .orderBy(asc(comments.createdAt));

  return NextResponse.json(
    { comments: rows.map((row) => mapComment(row, currentAnonIdHash)) },
    { headers: buildCorsHeaders(origin) },
  );
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    headers: buildCorsHeaders(origin),
    status: 204,
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const corsOrigin = resolveCorsOrigin(origin);

  if (origin && !corsOrigin) {
    return NextResponse.json(
      { error: "origin is not allowed" },
      { headers: buildCorsHeaders(origin), status: 403 },
    );
  }

  const rawBody = (await request.json().catch(() => null)) as unknown;
  const parsed = parseCreateCommentBody(rawBody);

  if ("error" in parsed) {
    return NextResponse.json(
      { error: parsed.error },
      { headers: buildCorsHeaders(origin), status: 400 },
    );
  }

  const anonIdHash = hashAnonId(parsed.data.anonId ?? "");
  const rows = await db
    .insert(comments)
    .values({
      authorAnonIdHash: anonIdHash,
      body: parsed.data.body ?? "",
      slug: parsed.data.slug ?? "",
    })
    .returning({
      authorAnonIdHash: comments.authorAnonIdHash,
      body: comments.body,
      createdAt: comments.createdAt,
      id: comments.id,
    });

  const inserted = rows[0];
  if (!inserted) {
    return NextResponse.json(
      { error: "failed to create comment" },
      { headers: buildCorsHeaders(origin), status: 500 },
    );
  }

  try {
    await notifySlack({
      action: "comment_add",
      body: inserted.body,
      slug: parsed.data.slug ?? "",
      url: parsed.data.slug ? buildPostUrl(origin, parsed.data.slug) : "",
    });
  } catch (error) {
    console.error("Slack notification failed", error);
  }

  return NextResponse.json(
    { comment: mapComment(inserted, anonIdHash) },
    { headers: buildCorsHeaders(origin) },
  );
}

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
      id: comments.id,
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

  return NextResponse.json(
    { comment: mapComment(inserted, anonIdHash) },
    { headers: buildCorsHeaders(origin) },
  );
}

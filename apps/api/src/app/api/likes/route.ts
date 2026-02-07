import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { likes, likeUsers } from "@/db/schema";

import { buildCorsHeaders, normalizeSlug, resolveCorsOrigin } from "./logic";

export const runtime = "nodejs";

type ToggleLikeBody = {
  anonId?: string;
  slug?: string;
  title?: string;
};

const buildPostUrl = (origin: null | string, slug: string) => {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    origin?.replace(/\/$/, "") ??
    "";
  if (!base) return "";
  return `${base}/blog/contents/${slug}/`;
};

const notifySlack = async (payload: {
  action: "like" | "unlike";
  count: number;
  slug: string;
  title?: string;
  url?: string;
}) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL is not set.");
    return;
  }

  const title = payload.title?.trim() || payload.slug;
  const urlSuffix = payload.url ? `\n${payload.url}` : "";
  const text = `:thumbsup: ${payload.action} ${title} (count: ${payload.count})${urlSuffix}`;
  try {
    const res = await fetch(webhookUrl, {
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Slack webhook failed", res.status, body);
    }
  } catch (error) {
    console.error("Slack webhook failed", error);
  }
};

const getCount = async (slug: string) => {
  const rows = await db
    .select({ count: likes.count })
    .from(likes)
    .where(eq(likes.slug, slug))
    .limit(1);
  return rows[0]?.count ?? 0;
};

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
  const count = await getCount(normalizedSlug);
  let liked = false;

  if (anonId) {
    const rows = await db
      .select({ slug: likeUsers.slug })
      .from(likeUsers)
      .where(
        and(eq(likeUsers.slug, normalizedSlug), eq(likeUsers.anonId, anonId)),
      )
      .limit(1);
    liked = rows.length > 0;
  }

  return NextResponse.json(
    { count, liked },
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
  const body = (await request.json()) as ToggleLikeBody;
  const slug = body.slug;
  const anonId = body.anonId;
  const title = body.title;
  const origin = request.headers.get("origin");
  const corsOrigin = resolveCorsOrigin(origin);

  if (origin && !corsOrigin) {
    return NextResponse.json(
      { error: "origin is not allowed" },
      { headers: buildCorsHeaders(origin), status: 403 },
    );
  }

  if (!slug || !anonId) {
    return NextResponse.json(
      { error: "slug and anonId are required" },
      { headers: buildCorsHeaders(origin), status: 400 },
    );
  }

  const normalizedSlug = normalizeSlug(slug);

  const result = await db.transaction(async (tx) => {
    const existing = await tx
      .select({ slug: likeUsers.slug })
      .from(likeUsers)
      .where(
        and(eq(likeUsers.slug, normalizedSlug), eq(likeUsers.anonId, anonId)),
      )
      .limit(1);

    if (existing.length > 0) {
      await tx
        .delete(likeUsers)
        .where(
          and(eq(likeUsers.slug, normalizedSlug), eq(likeUsers.anonId, anonId)),
        );

      await tx
        .insert(likes)
        .values({ count: 0, slug: normalizedSlug })
        .onConflictDoUpdate({
          set: {
            count: sql`greatest(${likes.count} - 1, 0)`,
            updatedAt: new Date(),
          },
          target: likes.slug,
        });

      const count = await tx
        .select({ count: likes.count })
        .from(likes)
        .where(eq(likes.slug, normalizedSlug))
        .limit(1);

      return { count: count[0]?.count ?? 0, liked: false };
    }

    await tx.insert(likeUsers).values({ anonId, slug: normalizedSlug });

    await tx
      .insert(likes)
      .values({ count: 1, slug: normalizedSlug })
      .onConflictDoUpdate({
        set: {
          count: sql`${likes.count} + 1`,
          updatedAt: new Date(),
        },
        target: likes.slug,
      });

    const count = await tx
      .select({ count: likes.count })
      .from(likes)
      .where(eq(likes.slug, normalizedSlug))
      .limit(1);

    return { count: count[0]?.count ?? 0, liked: true };
  });

  try {
    await notifySlack({
      action: result.liked ? "like" : "unlike",
      count: result.count,
      slug: normalizedSlug,
      title,
      url: buildPostUrl(origin, normalizedSlug),
    });
  } catch (error) {
    console.error("Slack notification failed", error);
  }

  return NextResponse.json(result, { headers: buildCorsHeaders(origin) });
}

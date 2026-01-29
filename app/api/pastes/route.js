export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redis } from "../../../lib/redis";
import { getNow } from "../../../lib/time";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  const now = getNow(req);
  const id = crypto.randomUUID().slice(0, 8);

  const expires_at =
    typeof ttl_seconds === "number"
      ? now + ttl_seconds * 1000
      : null;

  const paste = {
    id,
    content,
    created_at: now,
    expires_at,
    max_views:
      typeof max_views === "number" ? max_views : null,
    views: 0,
  };


  await redis.set(`paste:${id}`, JSON.stringify(paste));

  const host = req.headers.get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return Response.json({
    id,
    url: `${protocol}://${host}/p/${id}`,
  });
}

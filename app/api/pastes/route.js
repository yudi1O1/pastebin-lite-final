export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redis } from "../../../lib/redis.js";
import crypto from "crypto";

export async function POST(req) {
  const { content } = await req.json();
  const id = crypto.randomUUID().slice(0, 8);

  await redis.set(`paste:${id}`, { content });

  const host = req.headers.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  return Response.json({ id, url: `${protocol}://${host}/p/${id}` });
}
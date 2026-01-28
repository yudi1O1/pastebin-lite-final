export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redis } from "../../../../lib/redis.js";

export async function GET(req, { params }) {
  const paste = await redis.get(`paste:${params.id}`);
  if (!paste) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(paste);
}
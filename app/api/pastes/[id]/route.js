export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redis } from "../../../../lib/redis.js";
import { getNow } from "../../../../lib/time.js";

export async function GET(req, { params }) {
  const key = `paste:${params.id}`;

  // 🔥 Always parse JSON from Redis
  const raw = await redis.get(key);
  if (!raw) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const paste = typeof raw === "string" ? JSON.parse(raw) : raw;

  const now = getNow(req);

  // 1️⃣ TTL expired → delete & block
  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // 2️⃣ View limit exceeded → delete & block
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    await redis.del(key);
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // 3️⃣ Increment views BEFORE returning
  const updatedPaste = {
    ...paste,
    views: paste.views + 1,
  };

  // 🔥 Stringify before saving back
  await redis.set(key, JSON.stringify(updatedPaste));

  // 4️⃣ Return clean, PDF-compliant response
  return Response.json({
    content: updatedPaste.content,
    remaining_views:
      updatedPaste.max_views === null
        ? null
        : updatedPaste.max_views - updatedPaste.views,
    expires_at: updatedPaste.expires_at
      ? new Date(updatedPaste.expires_at).toISOString()
      : null,
  });
}

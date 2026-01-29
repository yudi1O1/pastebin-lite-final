export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redis } from "../../../../lib/redis.js";
import { getNow } from "../../../../lib/time.js";

export async function GET(req, { params }) {
  const key = `paste:${params.id}`;
  const paste = await redis.get(key);

  // 1️⃣ Not found
  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(req);

  // 2️⃣ TTL expired → delete
  if (paste.expires_at && now >= paste.expires_at) {
    await redis.del(key);
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  // 3️⃣ View limit exceeded → delete
  if (
    paste.max_views !== null &&
    paste.views >= paste.max_views
  ) {
    await redis.del(key);
    return Response.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  // 4️⃣ Increment views BEFORE returning
  const updatedPaste = {
    ...paste,
    views: paste.views + 1,
  };

  await redis.set(key, updatedPaste);

  // 5️⃣ Return clean response
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

"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    setLoading(true);
    setUrl("");

    const payload = {
      content,
      ttl_seconds: ttl ? Number(ttl) : undefined,
      max_views: maxViews ? Number(maxViews) : undefined,
    };

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setUrl(data.url);
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Pastebin Lite</h2>

      {/* Paste content */}
      <textarea
        rows={10}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="Paste your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* TTL */}
      <input
        type="number"
        placeholder="TTL in seconds (optional)"
        value={ttl}
        onChange={(e) => setTtl(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      {/* Max Views */}
      <input
        type="number"
        placeholder="Max views (optional)"
        value={maxViews}
        onChange={(e) => setMaxViews(e.target.value)}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <button onClick={createPaste} disabled={!content || loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>

      {/* Result URL */}
      {url && (
        <p style={{ marginTop: 16 }}>
          🔗 <a href={url}>{url}</a>
        </p>
      )}
    </main>
  );
}

"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text })
    });
    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Pastebin Lite</h2>
      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button onClick={submit}>Create Paste</button>
      {url && <p><a href={url}>{url}</a></p>}
    </main>
  );
}
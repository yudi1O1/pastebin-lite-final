export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { headers } from "next/headers";
import { notFound } from "next/navigation";

async function getPaste(id) {
  const headersList = headers();
  const host = headersList.get("host");

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function PastePage({ params }) {
  const paste = await getPaste(params.id);

  
  if (!paste) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Paste</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {paste.content}
      </pre>
    </main>
  );
}

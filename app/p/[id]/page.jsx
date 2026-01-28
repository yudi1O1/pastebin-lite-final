async function getPaste(id) {
  const res = await fetch(`/api/pastes/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({ params }) {
  const data = await getPaste(params.id);
  if (!data) return <h1>404 – Paste not found</h1>;

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <pre>{data.content}</pre>
    </main>
  );
}
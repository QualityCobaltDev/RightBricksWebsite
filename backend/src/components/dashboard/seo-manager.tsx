"use client";

import { useState } from "react";

export function SeoManager() {
  const [slug, setSlug] = useState("");
  const [output, setOutput] = useState<string>("");

  async function fetchMeta() {
    const response = await fetch(`/api/seo/metadata?listingSlug=${encodeURIComponent(slug)}`);
    const data = await response.json();
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">SEO Manager</h3>
      <div className="flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="listing-slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <button className="border rounded px-3" onClick={fetchMeta}>Load Metadata</button>
      </div>
      {output ? <pre className="bg-slate-900 text-white rounded p-3 text-xs overflow-auto">{output}</pre> : null}
    </section>
  );
}

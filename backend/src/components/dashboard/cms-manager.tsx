"use client";

import { useState } from "react";

export function CmsManager() {
  const [slug, setSlug] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [bodyEn, setBodyEn] = useState("");

  async function publish() {
    await fetch("/api/cms/articles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        slug,
        category: "guides",
        canonicalUrl: `https://rightbricks.online/guides/${slug}`,
        titleEn,
        bodyEn,
        publishNow: true,
      }),
    });
  }

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Content CMS</h3>
      <input className="border rounded p-2 w-full" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <input className="border rounded p-2 w-full" placeholder="English title" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      <textarea className="border rounded p-2 w-full" rows={6} placeholder="English body" value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} />
      <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={publish}>Publish</button>
    </section>
  );
}

"use client";

import { useState } from "react";

export function EditListingForm({ listingId, initialTitle }: { listingId: string; initialTitle: string }) {
  const [title, setTitle] = useState(initialTitle);

  async function save() {
    await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
  }

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Edit Listing</h3>
      <input className="border rounded p-2 w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={save}>Save changes</button>
    </section>
  );
}

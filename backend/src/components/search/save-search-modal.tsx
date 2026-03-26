"use client";

import { useState } from "react";
import { SearchFilters } from "@/search/types";

export function SaveSearchModal({ filters }: { filters: SearchFilters }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  async function save() {
    await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...filters,
        name,
        createAlert: true,
      }),
    });
    setOpen(false);
    setName("");
  }

  return (
    <>
      <button className="border rounded px-3 py-2" onClick={() => setOpen(true)}>Save Search</button>
      {open ? (
        <div className="fixed inset-0 bg-black/40 z-50 grid place-items-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded border p-4 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Save Search</h3>
            <p className="text-sm text-slate-500">Create a reusable search and optionally alert pipeline.</p>
            <input className="border rounded p-2 w-full mt-3" placeholder="Search name" value={name} onChange={(e) => setName(e.target.value)} />
            <div className="mt-4 flex justify-end gap-2">
              <button className="border rounded px-3 py-2" onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

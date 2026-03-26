"use client";

import { useState } from "react";
import { REJECTION_REASON_TEMPLATES } from "@/trust/types";

export function ReportListingModal({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState(REJECTION_REASON_TEMPLATES[0].code);
  const [description, setDescription] = useState("");

  async function submit() {
    await fetch("/api/reports/listing", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ listingId, reasonCode, description }),
    });
    setOpen(false);
    setDescription("");
  }

  return (
    <>
      <button className="border rounded px-3 py-2" onClick={() => setOpen(true)}>Report Listing</button>
      {open ? (
        <div className="fixed inset-0 bg-black/30 z-50 grid place-items-center" onClick={() => setOpen(false)}>
          <div className="bg-white rounded border p-4 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Report listing</h3>
            <select className="w-full border rounded p-2 mt-3" value={reasonCode} onChange={(e) => setReasonCode(e.target.value)}>
              {REJECTION_REASON_TEMPLATES.map((reason) => (
                <option key={reason.code} value={reason.code}>{reason.label}</option>
              ))}
            </select>
            <textarea className="w-full border rounded p-2 mt-3" rows={5} placeholder="Describe the issue" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="mt-4 flex justify-end gap-2">
              <button className="border rounded px-3 py-2" onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={submit}>Submit Report</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

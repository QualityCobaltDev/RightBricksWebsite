"use client";

import { useState } from "react";
import { RejectionReasonSelector } from "@/components/trust/rejection-reason-selector";

export function ModerationCaseDetailActions({ caseId }: { caseId: string }) {
  const [reasonCode, setReasonCode] = useState<string>("");
  const [note, setNote] = useState<string>("");

  async function action(type: "APPROVE" | "REJECT" | "SUSPEND" | "REQUEST_CHANGES") {
    await fetch(`/api/moderation/cases/${caseId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: type, reasonCode, note }),
    });
  }

  async function addNote() {
    await fetch(`/api/moderation/cases/${caseId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: note }),
    });
    setNote("");
  }

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="font-semibold">Moderation Decision</h3>
      <RejectionReasonSelector value={reasonCode} onChange={setReasonCode} />
      <textarea className="w-full border rounded p-2" rows={4} placeholder="Internal moderation note" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <button className="border rounded px-3 py-2" onClick={() => action("APPROVE")}>Approve</button>
        <button className="border rounded px-3 py-2" onClick={() => action("REQUEST_CHANGES")}>Request Changes</button>
        <button className="border rounded px-3 py-2" onClick={() => action("REJECT")}>Reject</button>
        <button className="border rounded px-3 py-2" onClick={() => action("SUSPEND")}>Suspend</button>
        <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={addNote}>Add Note</button>
      </div>
    </section>
  );
}

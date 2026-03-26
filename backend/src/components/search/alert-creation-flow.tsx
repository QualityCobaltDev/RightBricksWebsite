"use client";

import { useState } from "react";

export function AlertCreationFlow() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  async function create() {
    await fetch("/api/alerts/test", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ to: email }),
    });
    setStatus("Alert test sent.");
  }

  return (
    <section className="rounded border bg-white p-3 space-y-2">
      <h3 className="font-semibold">Alert Creation Flow</h3>
      <div className="flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Alert email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="border rounded px-3" onClick={create}>Create Alert</button>
      </div>
      {status ? <p className="text-xs text-emerald-700">{status}</p> : null}
    </section>
  );
}

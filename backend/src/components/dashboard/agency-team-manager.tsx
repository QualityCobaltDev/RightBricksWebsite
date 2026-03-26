"use client";

import { useState } from "react";

export function AgencyTeamManager({ members }: { members: Array<{ id: string; name: string; role: string }> }) {
  const [email, setEmail] = useState("");

  return (
    <section className="rounded border bg-white p-4 space-y-4">
      <h3 className="text-lg font-semibold">Agency Team Management</h3>
      <div className="space-y-2">
        {members.map((m) => (
          <div key={m.id} className="border rounded p-2 flex items-center justify-between">
            <div>{m.name}</div>
            <span className="text-xs border rounded px-2 py-1">{m.role}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Invite by email" className="border rounded p-2 flex-1" />
        <button className="border rounded px-3">Invite</button>
      </div>
    </section>
  );
}

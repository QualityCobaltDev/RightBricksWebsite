"use client";

export function ModerationQueue({
  rows,
}: {
  rows: Array<{ listingId: string; title: string; submittedAt: string }>;
}) {
  async function decide(listingId: string, decision: "APPROVED" | "REJECTED" | "NEEDS_CHANGES") {
    await fetch(`/api/admin/moderation/listings/${listingId}/decision`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decision }),
    });
  }

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Moderation Queue</h3>
      {rows.map((row) => (
        <article key={row.listingId} className="border rounded p-3 space-y-2">
          <p className="font-medium">{row.title}</p>
          <p className="text-sm text-slate-500">Submitted: {row.submittedAt}</p>
          <div className="flex gap-2">
            <button className="border rounded px-2 py-1" onClick={() => decide(row.listingId, "APPROVED")}>Approve</button>
            <button className="border rounded px-2 py-1" onClick={() => decide(row.listingId, "NEEDS_CHANGES")}>Request Changes</button>
            <button className="border rounded px-2 py-1" onClick={() => decide(row.listingId, "REJECTED")}>Reject</button>
          </div>
        </article>
      ))}
    </section>
  );
}

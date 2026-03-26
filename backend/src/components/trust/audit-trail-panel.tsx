export function AuditTrailPanel({
  rows,
}: {
  rows: Array<{ id: string; action: string; actor: string; createdAt: string }>;
}) {
  return (
    <section className="rounded border bg-white p-4 space-y-2">
      <h3 className="font-semibold">Audit Trail</h3>
      {rows.map((row) => (
        <article key={row.id} className="border rounded p-2">
          <p className="text-sm font-medium">{row.action}</p>
          <p className="text-xs text-slate-500">By {row.actor}</p>
          <p className="text-xs text-slate-500">{row.createdAt}</p>
        </article>
      ))}
    </section>
  );
}

export function VerificationQueue({
  rows,
}: {
  rows: Array<{ id: string; requestedType: string; status: string; createdAt: string }>;
}) {
  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Verification Queue</h3>
      {rows.map((row) => (
        <article key={row.id} className="border rounded p-3">
          <p className="font-medium">{row.requestedType}</p>
          <p className="text-sm text-slate-500">Status: {row.status}</p>
          <p className="text-sm text-slate-500">Requested: {row.createdAt}</p>
        </article>
      ))}
    </section>
  );
}

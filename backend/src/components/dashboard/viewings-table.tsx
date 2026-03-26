export function ViewingsTable({
  rows,
}: {
  rows: Array<{ id: string; listing: string; requester: string; requestedAt: string; status: string }>;
}) {
  return (
    <section className="rounded border bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-3 text-left">Listing</th>
            <th className="p-3 text-left">Requester</th>
            <th className="p-3 text-left">Requested Time</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3">{row.listing}</td>
              <td className="p-3">{row.requester}</td>
              <td className="p-3">{row.requestedAt}</td>
              <td className="p-3">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function InquiriesTable({
  rows,
}: {
  rows: Array<{ id: string; name: string; listing: string; status: string; createdAt: string }>;
}) {
  return (
    <section className="rounded border bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-3 text-left">Lead</th>
            <th className="p-3 text-left">Listing</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3">{row.name}</td>
              <td className="p-3">{row.listing}</td>
              <td className="p-3">{row.status}</td>
              <td className="p-3">{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

import { ListingStatus } from "@prisma/client";

export type ListingRow = {
  id: string;
  title: string;
  type: string;
  priceUsd: string;
  status: ListingStatus;
  updatedAt: string;
};

export function ListingTable({ rows }: { rows: ListingRow[] }) {
  return (
    <div className="rounded border bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left p-3">Title</th>
            <th className="text-left p-3">Type</th>
            <th className="text-left p-3">Price (USD)</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3">{row.title}</td>
              <td className="p-3">{row.type}</td>
              <td className="p-3">{row.priceUsd}</td>
              <td className="p-3">{row.status}</td>
              <td className="p-3">{row.updatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

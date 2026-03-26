import Link from "next/link";
import { VerificationStatusPill } from "@/components/trust/verification-status-pill";

export function ModerationQueueTable({
  rows,
}: {
  rows: Array<{
    id: string;
    listingTitle: string;
    reportReason?: string | null;
    priority: number;
    status: string;
    createdAt: string;
  }>;
}) {
  return (
    <div className="rounded border bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-3 text-left">Case</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Priority</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t">
              <td className="p-3"><Link className="underline" href={`/moderation/cases/${row.id}`}>{row.listingTitle}</Link></td>
              <td className="p-3">{row.reportReason ?? "-"}</td>
              <td className="p-3">{row.priority}</td>
              <td className="p-3"><VerificationStatusPill status={row.status} /></td>
              <td className="p-3">{row.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

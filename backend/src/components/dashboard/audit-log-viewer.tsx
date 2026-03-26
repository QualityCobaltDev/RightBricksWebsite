import { prisma } from "@/lib/prisma";

export async function AuditLogViewer() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Audit Log Viewer</h3>
      {logs.map((log) => (
        <article key={log.id} className="border rounded p-2">
          <p className="text-sm font-medium">{log.action}</p>
          <p className="text-xs text-slate-500">{log.entityType}#{log.entityId}</p>
          <p className="text-xs text-slate-500">{log.createdAt.toISOString()}</p>
        </article>
      ))}
    </section>
  );
}

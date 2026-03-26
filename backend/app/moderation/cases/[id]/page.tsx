import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { getModerationCaseById } from "@/services/moderation-case.service";
import { deriveFraudSignals } from "@/trust/use-fraud-signals";
import { ModerationCaseDetailActions } from "@/components/trust/moderation-case-detail";
import { FraudSignalPanel } from "@/components/trust/fraud-signal-panel";
import { AuditTrailPanel } from "@/components/trust/audit-trail-panel";
import { VerificationStatusPill } from "@/components/trust/verification-status-pill";

export default async function ModerationCasePage({ params }: { params: Promise<{ id: string }> }) {
  await requireDashboardAccess(["MODERATOR", "SUPER_ADMIN", "ADMIN"]);
  const { id } = await params;

  const [record, auditRows] = await Promise.all([
    getModerationCaseById(id),
    prisma.auditLog.findMany({ where: { entityType: "ModerationCase", entityId: id }, orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const fraudSignals = deriveFraudSignals({
    duplicateCount: record.listing?.abuseReports.length ?? 0,
    reportCount: record.listing?.abuseReports.length ?? 0,
    unverifiedPublisher: record.listing?.owner ? record.listing.owner.verificationStatus !== "VERIFIED" : true,
  });

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <section className="rounded border bg-white p-4 space-y-2">
        <h1 className="text-2xl font-semibold">Moderation Case {record.id}</h1>
        <p className="text-sm">Listing: {record.listing?.translations[0]?.title ?? record.listing?.slug ?? "N/A"}</p>
        <VerificationStatusPill status={record.status} />
        {record.abuseReport ? <p className="text-sm">Report reason: {record.abuseReport.reasonCode}</p> : null}
      </section>

      <FraudSignalPanel signals={fraudSignals} />
      <ModerationCaseDetailActions caseId={record.id} />
      <AuditTrailPanel rows={auditRows.map((row) => ({ id: row.id, action: row.action, actor: row.actorLabel ?? row.actorUserId ?? "system", createdAt: row.createdAt.toISOString() }))} />
    </main>
  );
}

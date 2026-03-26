import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { listModerationCases } from "@/services/moderation-case.service";
import { ModerationQueueTable } from "@/components/trust/moderation-queue-table";

export default async function ModerationCasesPage() {
  await requireDashboardAccess(["MODERATOR", "SUPER_ADMIN", "ADMIN"]);
  const cases = await listModerationCases();

  return (
    <main className="rb-container" style={{ padding: "1rem" }}>
      <section className="rb-card" style={{ marginBottom: 14 }}>
        <h1 style={{ marginTop: 0 }}>Moderation cases</h1>
        <p className="rb-muted">Review case context, prioritize risk, and process decisions with clear operational visibility.</p>
      </section>
      <ModerationQueueTable rows={cases.map((c) => ({
        id: c.id,
        listingTitle: c.listing?.translations[0]?.title ?? c.listing?.slug ?? "Unknown",
        reportReason: c.abuseReport?.reasonCode,
        priority: c.priority,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      }))} />
    </main>
  );
}

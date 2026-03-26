import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { listModerationCases } from "@/services/moderation-case.service";
import { ModerationQueueTable } from "@/components/trust/moderation-queue-table";

export default async function ModerationCasesPage() {
  await requireDashboardAccess(["MODERATOR", "SUPER_ADMIN", "ADMIN"]);
  const cases = await listModerationCases();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Moderation Queue</h1>
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

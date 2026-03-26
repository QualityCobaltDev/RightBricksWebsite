import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { ListingTable } from "@/components/dashboard/listing-table";
import { AgencyTeamManager } from "@/components/dashboard/agency-team-manager";

export default async function AgencyAdminDashboard() {
  const { user } = await requireDashboardAccess(["AGENCY_ADMIN"]);

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id, organization: { type: "AGENCY" } },
    include: { organization: { include: { members: { include: { user: true } }, listings: { include: { translations: true } } } } },
  });

  const org = membership?.organization;

  return (
    <div className="space-y-4">
      <MetricsCards title="Agency Metrics" stats={[
        { label: "Active Team", value: String(org?.members.length ?? 0) },
        { label: "Listings", value: String(org?.listings.length ?? 0) },
        { label: "Published", value: String(org?.listings.filter((l) => l.status === "PUBLISHED").length ?? 0) },
        { label: "Pending", value: String(org?.listings.filter((l) => l.status === "PENDING_REVIEW").length ?? 0) },
      ]} />

      <AgencyTeamManager members={(org?.members ?? []).map((m) => ({ id: m.id, name: `${m.user.firstName ?? ""} ${m.user.lastName ?? ""}`.trim(), role: m.title ?? "member" }))} />
      <ListingTable rows={(org?.listings ?? []).map((l) => ({ id: l.id, title: l.translations[0]?.title ?? l.slug, type: l.listingType, priceUsd: l.priceUsd.toString(), status: l.status, updatedAt: l.updatedAt.toISOString() }))} />
    </div>
  );
}

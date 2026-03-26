import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { DeveloperProjectManager } from "@/components/dashboard/developer-project-manager";
import { ListingTable } from "@/components/dashboard/listing-table";

export default async function DeveloperDashboard() {
  const { user } = await requireDashboardAccess(["DEVELOPER_ADMIN"]);

  const membership = await prisma.organizationMember.findFirst({
    where: { userId: user.id, organization: { type: "DEVELOPER" } },
    include: {
      organization: {
        include: {
          projects: { include: { unitTypes: true } },
          listings: { include: { translations: true } },
        },
      },
    },
  });

  const org = membership?.organization;

  return (
    <div className="space-y-4">
      <MetricsCards title="Developer Metrics" stats={[
        { label: "Projects", value: String(org?.projects.length ?? 0) },
        { label: "Units (sum)", value: String((org?.projects ?? []).reduce((acc, p) => acc + p.unitTypes.reduce((s, u) => s + (u.availableUnits ?? 0), 0), 0)) },
        { label: "Listings", value: String(org?.listings.length ?? 0) },
        { label: "Published", value: String(org?.listings.filter((l) => l.status === "PUBLISHED").length ?? 0) },
      ]} />

      <DeveloperProjectManager projects={(org?.projects ?? []).map((p) => ({ id: p.id, name: p.slug, status: p.status, units: p.unitTypes.reduce((s, u) => s + (u.availableUnits ?? 0), 0) }))} />
      <ListingTable rows={(org?.listings ?? []).map((l) => ({ id: l.id, title: l.translations[0]?.title ?? l.slug, type: l.listingType, priceUsd: l.priceUsd.toString(), status: l.status, updatedAt: l.updatedAt.toISOString() }))} />
    </div>
  );
}

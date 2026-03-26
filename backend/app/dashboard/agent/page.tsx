import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { ListingTable } from "@/components/dashboard/listing-table";
import { InquiriesTable } from "@/components/dashboard/inquiries-table";
import { ViewingsTable } from "@/components/dashboard/viewings-table";
import { CreateListingWizard } from "@/components/dashboard/create-listing-wizard";

export default async function AgentDashboard() {
  const { user } = await requireDashboardAccess(["AGENT"]);

  const listings = await prisma.listing.findMany({ where: { creatorId: user.id, deletedAt: null }, include: { translations: true }, take: 30 });
  const inquiries = await prisma.inquiry.findMany({ where: { assignedToId: user.id }, include: { listing: { include: { translations: true } } }, take: 30 });
  const viewings = await prisma.viewingRequest.findMany({ where: { assignedAgentId: user.id }, include: { listing: { include: { translations: true } }, requester: true }, take: 30 });

  return (
    <div className="space-y-4">
      <MetricsCards title="Agent Pipeline" stats={[
        { label: "My Listings", value: String(listings.length) },
        { label: "Assigned Inquiries", value: String(inquiries.length) },
        { label: "Assigned Viewings", value: String(viewings.length) },
        { label: "Published", value: String(listings.filter((l) => l.status === "PUBLISHED").length) },
      ]} />

      <CreateListingWizard />
      <ListingTable rows={listings.map((l) => ({ id: l.id, title: l.translations[0]?.title ?? l.slug, type: l.listingType, priceUsd: l.priceUsd.toString(), status: l.status, updatedAt: l.updatedAt.toISOString() }))} />
      <InquiriesTable rows={inquiries.map((i) => ({ id: i.id, name: i.name, listing: i.listing?.translations[0]?.title ?? "-", status: i.status, createdAt: i.createdAt.toISOString() }))} />
      <ViewingsTable rows={viewings.map((v) => ({ id: v.id, listing: v.listing.translations[0]?.title ?? v.listing.slug, requester: v.requester.email, requestedAt: v.requestedAt.toISOString(), status: v.status }))} />
    </div>
  );
}

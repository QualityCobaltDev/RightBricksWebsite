import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { ListingTable } from "@/components/dashboard/listing-table";
import { InquiriesTable } from "@/components/dashboard/inquiries-table";
import { ViewingsTable } from "@/components/dashboard/viewings-table";
import { ListingStatusControls } from "@/components/dashboard/status-controls";
import { EditListingForm } from "@/components/dashboard/edit-listing-form";

export default async function OwnerDashboard() {
  const { user } = await requireDashboardAccess(["OWNER", "LANDLORD"]);

  const listings = await prisma.listing.findMany({ where: { ownerId: user.id, deletedAt: null }, include: { translations: true }, take: 20 });
  const inquiries = await prisma.inquiry.findMany({ where: { listing: { ownerId: user.id } }, include: { listing: { include: { translations: true } } }, take: 20 });
  const viewings = await prisma.viewingRequest.findMany({ where: { requesterId: user.id }, include: { listing: { include: { translations: true } } }, take: 20 });

  return (
    <div className="space-y-4">
      <MetricsCards title="Owner Performance" stats={[
        { label: "Active Listings", value: String(listings.length) },
        { label: "Inquiries", value: String(inquiries.length) },
        { label: "Viewings", value: String(viewings.length) },
        { label: "Published", value: String(listings.filter((l) => l.status === "PUBLISHED").length) },
      ]} />

      <ListingTable rows={listings.map((l) => ({ id: l.id, title: l.translations[0]?.title ?? l.slug, type: l.listingType, priceUsd: l.priceUsd.toString(), status: l.status, updatedAt: l.updatedAt.toISOString() }))} />
      {listings[0] ? <ListingStatusControls listingId={listings[0].id} /> : null}
      {listings[0] ? <EditListingForm listingId={listings[0].id} initialTitle={listings[0].translations[0]?.title ?? listings[0].slug} /> : null}

      <InquiriesTable rows={inquiries.map((i) => ({ id: i.id, name: i.name, listing: i.listing?.translations[0]?.title ?? "-", status: i.status, createdAt: i.createdAt.toISOString() }))} />
      <ViewingsTable rows={viewings.map((v) => ({ id: v.id, listing: v.listing.translations[0]?.title ?? v.listing.slug, requester: user.email, requestedAt: v.requestedAt.toISOString(), status: v.status }))} />
    </div>
  );
}

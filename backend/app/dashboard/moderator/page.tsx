import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { ModerationQueue } from "@/components/dashboard/moderation-queue";
import { VerificationQueue } from "@/components/dashboard/verification-queue";

export default async function ModeratorDashboard() {
  await requireDashboardAccess(["MODERATOR"]);

  const pendingListings = await prisma.listing.findMany({
    where: { status: "PENDING_REVIEW", deletedAt: null },
    include: { translations: true },
    take: 50,
  });

  const verifications = await prisma.verificationRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <ModerationQueue rows={pendingListings.map((l) => ({ listingId: l.id, title: l.translations[0]?.title ?? l.slug, submittedAt: l.createdAt.toISOString() }))} />
      <VerificationQueue rows={verifications.map((v) => ({ id: v.id, requestedType: v.requestedType, status: v.status, createdAt: v.createdAt.toISOString() }))} />
    </div>
  );
}

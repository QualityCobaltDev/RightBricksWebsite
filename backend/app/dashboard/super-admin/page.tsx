import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { ModerationQueue } from "@/components/dashboard/moderation-queue";
import { VerificationQueue } from "@/components/dashboard/verification-queue";
import { CmsManager } from "@/components/dashboard/cms-manager";
import { HomepageSectionsManager } from "@/components/dashboard/homepage-sections-manager";
import { SeoManager } from "@/components/dashboard/seo-manager";
import { SettingsManager } from "@/components/dashboard/settings-manager";
import { AuditLogViewer } from "@/components/dashboard/audit-log-viewer";
import { OperationsPanel } from "@/components/dashboard/operations-panel";

export default async function SuperAdminDashboard() {
  await requireDashboardAccess(["SUPER_ADMIN", "ADMIN"]);

  const [users, listings, inquiries, publishedArticles, pendingListings, verifications] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.listing.count({ where: { deletedAt: null } }),
    prisma.inquiry.count({ where: { deletedAt: null } }),
    prisma.cmsArticle.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.listing.findMany({ where: { status: "PENDING_REVIEW", deletedAt: null }, include: { translations: true }, take: 15 }),
    prisma.verificationRequest.findMany({ where: { status: "PENDING" }, take: 15 }),
  ]);

  return (
    <div className="space-y-4">
      <MetricsCards title="Super Admin Overview" stats={[
        { label: "Users", value: String(users) },
        { label: "Listings", value: String(listings) },
        { label: "Inquiries", value: String(inquiries) },
        { label: "Published Articles", value: String(publishedArticles) },
      ]} />
      <ModerationQueue rows={pendingListings.map((l) => ({ listingId: l.id, title: l.translations[0]?.title ?? l.slug, submittedAt: l.createdAt.toISOString() }))} />
      <VerificationQueue rows={verifications.map((v) => ({ id: v.id, requestedType: v.requestedType, status: v.status, createdAt: v.createdAt.toISOString() }))} />
      <CmsManager />
      <HomepageSectionsManager />
      <SeoManager />
      <SettingsManager />
      <AuditLogViewer />
      <OperationsPanel />
    </div>
  );
}

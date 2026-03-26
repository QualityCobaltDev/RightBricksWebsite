import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { prisma } from "@/lib/prisma";
import { CmsManager } from "@/components/dashboard/cms-manager";
import { HomepageSectionsManager } from "@/components/dashboard/homepage-sections-manager";
import { SeoManager } from "@/components/dashboard/seo-manager";

export default async function ContentEditorDashboard() {
  await requireDashboardAccess(["CONTENT_EDITOR"]);
  const published = await prisma.cmsArticle.count({ where: { status: "PUBLISHED", deletedAt: null } });

  return (
    <div className="space-y-4">
      <section className="rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">Content Editor Dashboard</h2>
        <p className="text-sm text-slate-500">Published articles: {published}</p>
      </section>
      <CmsManager />
      <HomepageSectionsManager />
      <SeoManager />
    </div>
  );
}

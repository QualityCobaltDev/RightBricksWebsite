import Link from "next/link";
import { RoleCode } from "@prisma/client";
import { NavItem } from "@/components/dashboard/types";

const NAV_BY_ROLE: Record<string, NavItem[]> = {
  OWNER: [
    { label: "Overview", href: "/dashboard/owner" },
    { label: "Listings", href: "/dashboard/owner?tab=listings" },
    { label: "Inquiries", href: "/dashboard/owner?tab=inquiries" },
    { label: "Viewings", href: "/dashboard/owner?tab=viewings" },
  ],
  LANDLORD: [
    { label: "Overview", href: "/dashboard/owner" },
    { label: "Listings", href: "/dashboard/owner?tab=listings" },
    { label: "Inquiries", href: "/dashboard/owner?tab=inquiries" },
    { label: "Viewings", href: "/dashboard/owner?tab=viewings" },
  ],
  AGENT: [
    { label: "Overview", href: "/dashboard/agent" },
    { label: "Create Listing", href: "/dashboard/agent?tab=create" },
    { label: "Inquiries", href: "/dashboard/agent?tab=inquiries" },
    { label: "Viewings", href: "/dashboard/agent?tab=viewings" },
  ],
  AGENCY_ADMIN: [
    { label: "Overview", href: "/dashboard/agency-admin" },
    { label: "Team", href: "/dashboard/agency-admin?tab=team" },
    { label: "Listings", href: "/dashboard/agency-admin?tab=listings" },
    { label: "Performance", href: "/dashboard/agency-admin?tab=metrics" },
  ],
  DEVELOPER_ADMIN: [
    { label: "Overview", href: "/dashboard/developer" },
    { label: "Projects", href: "/dashboard/developer?tab=projects" },
    { label: "Listings", href: "/dashboard/developer?tab=listings" },
  ],
  SUPER_ADMIN: [
    { label: "Overview", href: "/dashboard/super-admin" },
    { label: "Moderation", href: "/dashboard/super-admin?tab=moderation" },
    { label: "Verification", href: "/dashboard/super-admin?tab=verification" },
    { label: "CMS", href: "/dashboard/super-admin?tab=cms" },
    { label: "SEO", href: "/dashboard/super-admin?tab=seo" },
    { label: "Settings", href: "/dashboard/super-admin?tab=settings" },
    { label: "Audit Logs", href: "/dashboard/super-admin?tab=audit" },
    { label: "Operations", href: "/dashboard/super-admin?tab=ops" },
  ],
  MODERATOR: [
    { label: "Queue", href: "/dashboard/moderator" },
    { label: "Verification", href: "/dashboard/moderator?tab=verification" },
  ],
  CONTENT_EDITOR: [
    { label: "Articles", href: "/dashboard/content-editor" },
    { label: "Homepage", href: "/dashboard/content-editor?tab=homepage" },
    { label: "SEO", href: "/dashboard/content-editor?tab=seo" },
  ],
};

export function SidebarNav({ roles }: { roles: RoleCode[] }) {
  const unique = new Map<string, NavItem>();
  roles.forEach((role) => {
    (NAV_BY_ROLE[role] ?? []).forEach((item) => unique.set(item.href, item));
  });

  return (
    <aside className="w-72 min-h-screen border-r bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">RightBricks Dashboard</h2>
      <nav className="space-y-2">
        {[...unique.values()].map((item) => (
          <Link key={item.href} href={item.href} className="block rounded border p-2 hover:bg-slate-50">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

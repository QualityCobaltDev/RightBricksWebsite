import { ReactNode } from "react";
import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { roles, user } = await requireDashboardAccess([
    "OWNER",
    "LANDLORD",
    "AGENT",
    "AGENCY_ADMIN",
    "DEVELOPER_ADMIN",
    "SUPER_ADMIN",
    "MODERATOR",
    "CONTENT_EDITOR",
  ]);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SidebarNav roles={roles} />
      <main className="flex-1 p-6 space-y-4">
        <header className="bg-white rounded border p-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </header>
        {children}
      </main>
    </div>
  );
}

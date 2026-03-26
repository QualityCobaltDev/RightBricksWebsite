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
    <div style={{ minHeight: "100vh", display: "flex", background: "#eef2ff" }}>
      <SidebarNav roles={roles} />
      <main style={{ flex: 1, padding: "1rem" }}>
        <header className="rb-card" style={{ marginBottom: 12 }}>
          <h1 style={{ marginTop: 0 }}>Dashboard</h1>
          <p className="rb-muted" style={{ marginBottom: 0 }}>{user.email}</p>
        </header>
        {children}
      </main>
    </div>
  );
}

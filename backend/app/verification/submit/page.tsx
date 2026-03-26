import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { getVerificationStatuses } from "@/services/verification.service";
import { VerificationSubmissionForm } from "@/components/trust/verification-submission-form";
import { VerificationStatusPill } from "@/components/trust/verification-status-pill";

export default async function VerificationSubmitPage() {
  const { user } = await requireDashboardAccess(["OWNER", "LANDLORD", "AGENT", "AGENCY_ADMIN", "DEVELOPER_ADMIN"]);
  const statuses = await getVerificationStatuses(user.id);

  return (
    <main className="rb-container" style={{ padding: "1rem" }}>
      <section className="rb-card" style={{ marginBottom: 14 }}>
        <h1 style={{ marginTop: 0 }}>Verification center</h1>
        <p className="rb-muted">Submit business or identity documentation to unlock verified trust indicators across listings and profile surfaces.</p>
      </section>
      <VerificationSubmissionForm />

      <section className="rb-card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>Your verification history</h2>
        {statuses.userRequests.length ? statuses.userRequests.map((item) => (
          <article key={item.id} className="rb-card" style={{ padding: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{item.requestedType}</p>
                <p className="rb-muted" style={{ margin: 0 }}>{item.createdAt.toISOString()}</p>
              </div>
              <VerificationStatusPill status={item.status} />
            </div>
          </article>
        )) : <p className="rb-muted">No submissions yet.</p>}
      </section>
    </main>
  );
}

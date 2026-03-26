import { requireDashboardAccess } from "@/lib/dashboard-auth";
import { getVerificationStatuses } from "@/services/verification.service";
import { VerificationSubmissionForm } from "@/components/trust/verification-submission-form";
import { VerificationStatusPill } from "@/components/trust/verification-status-pill";

export default async function VerificationSubmitPage() {
  const { user } = await requireDashboardAccess(["OWNER", "LANDLORD", "AGENT", "AGENCY_ADMIN", "DEVELOPER_ADMIN"]);
  const statuses = await getVerificationStatuses(user.id);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <VerificationSubmissionForm />

      <section className="rounded border bg-white p-4 space-y-2">
        <h2 className="font-semibold">Your Verification History</h2>
        {statuses.userRequests.map((item) => (
          <article key={item.id} className="border rounded p-2 flex items-center justify-between">
            <div>
              <p className="text-sm">{item.requestedType}</p>
              <p className="text-xs text-slate-500">{item.createdAt.toISOString()}</p>
            </div>
            <VerificationStatusPill status={item.status} />
          </article>
        ))}
      </section>
    </main>
  );
}

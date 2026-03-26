import { VerificationStatusPill } from "@/components/trust/verification-status-pill";

export function ListingTrustBadge({ isVerified, publisherVerified }: { isVerified: boolean; publisherVerified: boolean }) {
  if (isVerified && publisherVerified) {
    return (
      <div className="inline-flex items-center gap-2 rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs">
        <span>✅</span>
        <span>Listing + Publisher Verified</span>
      </div>
    );
  }

  if (isVerified) return <VerificationStatusPill status="VERIFIED_LISTING" />;
  if (publisherVerified) return <VerificationStatusPill status="VERIFIED_PUBLISHER" />;

  return <VerificationStatusPill status="UNVERIFIED" />;
}

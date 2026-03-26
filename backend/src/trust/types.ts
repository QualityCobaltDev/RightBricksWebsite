export const REJECTION_REASON_TEMPLATES = [
  { code: "DUPLICATE_LISTING", label: "Duplicate listing" },
  { code: "MISLEADING_CONTENT", label: "Misleading title or description" },
  { code: "INVALID_PRICE", label: "Invalid or deceptive pricing" },
  { code: "LOW_QUALITY_MEDIA", label: "Low-quality or irrelevant media" },
  { code: "MISSING_OWNERSHIP_PROOF", label: "Missing ownership/authorization proof" },
  { code: "POLICY_VIOLATION", label: "Policy violation" },
];

export type FraudSignal = {
  id: string;
  severity: "low" | "medium" | "high";
  label: string;
  details: string;
};

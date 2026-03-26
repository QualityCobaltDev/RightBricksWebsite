"use client";

import { REJECTION_REASON_TEMPLATES } from "@/trust/types";

export function RejectionReasonSelector({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <select className="w-full border rounded p-2" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select reason</option>
      {REJECTION_REASON_TEMPLATES.map((reason) => (
        <option key={reason.code} value={reason.code}>{reason.label}</option>
      ))}
    </select>
  );
}

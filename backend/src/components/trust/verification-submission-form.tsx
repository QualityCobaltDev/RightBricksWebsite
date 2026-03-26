"use client";

import { useState } from "react";

export function VerificationSubmissionForm() {
  const [requestedType, setRequestedType] = useState("publisher_kyc");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function submit() {
    if (!file) return;

    const uploadResp = await fetch("/api/verification/upload-url", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
    });
    const uploadPayload = await uploadResp.json();

    await fetch(uploadPayload.data.uploadUrl, {
      method: "PUT",
      headers: uploadPayload.data.headers,
      body: file,
    });

    await fetch("/api/verification/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ requestedType, documentStorageKey: uploadPayload.data.objectKey }),
    });

    setStatus("Verification submitted successfully.");
  }

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h1 className="text-xl font-semibold">Verification Submission</h1>
      <select className="w-full border rounded p-2" value={requestedType} onChange={(e) => setRequestedType(e.target.value)}>
        <option value="publisher_kyc">Publisher KYC</option>
        <option value="agency_license">Agency License</option>
        <option value="developer_certificate">Developer Certificate</option>
      </select>
      <input type="file" className="w-full" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={submit}>Submit Verification</button>
      {status ? <p className="text-sm text-emerald-700">{status}</p> : null}
    </section>
  );
}

"use client";

import { useState } from "react";

export function VerificationSubmissionForm() {
  const [requestedType, setRequestedType] = useState("publisher_kyc");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!file || loading) {
      setStatus("Please choose a document to continue.");
      return;
    }
    setLoading(true);
    setStatus("Submitting verification...");

    try {
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
    } catch {
      setStatus("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rb-card">
      <h2 style={{ marginTop: 0 }}>Submit documents</h2>
      <p className="rb-muted">Your data is processed for trust and compliance verification only.</p>
      <label>
        Verification type
        <select className="rb-select" value={requestedType} onChange={(e) => setRequestedType(e.target.value)}>
          <option value="publisher_kyc">Publisher KYC</option>
          <option value="agency_license">Agency License</option>
          <option value="developer_certificate">Developer Certificate</option>
        </select>
      </label>
      <label>
        Document upload
        <input type="file" className="rb-input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>
      <button className="rb-btn rb-btn-primary" onClick={submit} disabled={loading}>{loading ? "Submitting..." : "Submit verification"}</button>
      {status ? <p className="rb-muted">{status}</p> : null}
    </section>
  );
}

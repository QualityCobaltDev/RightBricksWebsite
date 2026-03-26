import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="rb-container" style={{ padding: "2rem 1rem" }}>
      <section className="rb-card" style={{ maxWidth: 620, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>Unauthorized access</h1>
        <p className="rb-muted">Your account role does not currently allow this action. If this is unexpected, sign in with an authorized account or contact an administrator.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/login" className="rb-btn rb-btn-primary">Go to login</Link>
          <Link href="/" className="rb-btn rb-btn-secondary">Return home</Link>
        </div>
      </section>
    </main>
  );
}

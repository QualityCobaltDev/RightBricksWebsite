import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="rb-container" style={{ padding: "2rem 1rem" }}>
      <section className="rb-card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>Secure sign in to RightBricks</h1>
        <p className="rb-muted">Authenticate through the platform API and manage your listings, moderation workflows, and verification status securely.</p>
        <div className="rb-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <Link href="/api/auth/login" className="rb-btn rb-btn-primary">Open login API</Link>
          <Link href="/unauthorized" className="rb-btn rb-btn-secondary">Access help</Link>
        </div>
      </section>
    </main>
  );
}

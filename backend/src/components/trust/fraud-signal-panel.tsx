import { FraudSignal } from "@/trust/types";

export function FraudSignalPanel({ signals }: { signals: FraudSignal[] }) {
  if (!signals.length) {
    return <div className="rounded border bg-white p-3 text-sm text-slate-500">No high-risk fraud signals detected.</div>;
  }

  return (
    <section className="rounded border bg-white p-4 space-y-2">
      <h3 className="font-semibold">Fraud Signals</h3>
      {signals.map((signal) => (
        <article key={signal.id} className="rounded border p-3">
          <p className="font-medium">{signal.label} <span className="text-xs text-slate-500">({signal.severity})</span></p>
          <p className="text-sm text-slate-600">{signal.details}</p>
        </article>
      ))}
    </section>
  );
}

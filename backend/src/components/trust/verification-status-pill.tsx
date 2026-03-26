export function VerificationStatusPill({ status }: { status: string }) {
  const color =
    status === "VERIFIED"
      ? "bg-emerald-100 text-emerald-800"
      : status === "PENDING"
        ? "bg-amber-100 text-amber-800"
        : status === "REJECTED"
          ? "bg-rose-100 text-rose-800"
          : "bg-slate-100 text-slate-700";

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${color}`}>{status}</span>;
}

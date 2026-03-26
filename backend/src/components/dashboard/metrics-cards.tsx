export function MetricsCards({
  title,
  stats,
}: {
  title: string;
  stats: Array<{ label: string; value: string; trend?: string }>;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {stats.map((item) => (
          <article key={item.label} className="rounded border p-4 bg-white">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="text-2xl font-semibold">{item.value}</p>
            {item.trend ? <p className="text-xs text-emerald-600">{item.trend}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

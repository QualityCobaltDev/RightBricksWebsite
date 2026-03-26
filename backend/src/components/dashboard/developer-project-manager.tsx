export function DeveloperProjectManager({
  projects,
}: {
  projects: Array<{ id: string; name: string; status: string; units: number }>;
}) {
  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Developer Project Management</h3>
      {projects.map((project) => (
        <article key={project.id} className="border rounded p-3">
          <p className="font-medium">{project.name}</p>
          <p className="text-sm text-slate-500">Status: {project.status}</p>
          <p className="text-sm text-slate-500">Units: {project.units}</p>
        </article>
      ))}
    </section>
  );
}

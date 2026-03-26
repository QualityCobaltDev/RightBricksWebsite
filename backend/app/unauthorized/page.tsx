export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 p-6">
      <section className="bg-white border rounded p-6 max-w-md w-full">
        <h1 className="text-xl font-semibold">Unauthorized</h1>
        <p className="text-sm text-slate-500 mt-2">Your role does not have access to this dashboard route.</p>
      </section>
    </main>
  );
}

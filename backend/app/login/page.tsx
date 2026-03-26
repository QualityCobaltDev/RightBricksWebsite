export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-slate-100 p-6">
      <section className="bg-white border rounded p-6 max-w-md w-full">
        <h1 className="text-xl font-semibold">Login required</h1>
        <p className="text-sm text-slate-500 mt-2">Use the API login endpoint and set rb_access_token cookie from your auth frontend.</p>
      </section>
    </main>
  );
}

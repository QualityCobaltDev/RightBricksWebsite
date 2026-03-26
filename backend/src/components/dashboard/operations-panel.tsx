import { getSiteSettings } from "@/lib/site-settings";

export function OperationsPanel() {
  const settings = getSiteSettings();

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Live Production Operations</h3>
      <ul className="list-disc pl-6 text-sm text-slate-700">
        <li>Domain: {settings.canonicalBaseUrl}</li>
        <li>Incident Contact: {settings.opsEmail}</li>
        <li>Alerts Enabled: {String(settings.alertsEnabled)}</li>
        <li>Maintenance Mode: {String(settings.maintenanceMode)}</li>
      </ul>
      <div className="rounded border p-3 text-sm">
        <p>Recommended restart command:</p>
        <code>sudo systemctl restart rightbricks-backend.service</code>
      </div>
    </section>
  );
}

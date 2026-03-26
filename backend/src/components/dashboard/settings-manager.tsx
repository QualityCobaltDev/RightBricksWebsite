import { getSiteSettings } from "@/lib/site-settings";

export function SettingsManager() {
  const settings = getSiteSettings();

  return (
    <section className="rounded border bg-white p-4 space-y-2">
      <h3 className="text-lg font-semibold">Settings Manager</h3>
      <p className="text-sm">Site: {settings.siteName}</p>
      <p className="text-sm">Canonical URL: {settings.canonicalBaseUrl}</p>
      <p className="text-sm">Support Email: {settings.supportEmail}</p>
      <p className="text-sm">Ops Email: {settings.opsEmail}</p>
      <p className="text-sm">Alerts Enabled: {String(settings.alertsEnabled)}</p>
      <p className="text-sm">Maintenance Mode: {String(settings.maintenanceMode)}</p>
    </section>
  );
}

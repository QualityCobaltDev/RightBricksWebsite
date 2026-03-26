import { env } from "@/config/env";

export function getSiteSettings() {
  return {
    siteName: env.APP_NAME,
    canonicalBaseUrl: env.CANONICAL_BASE_URL,
    supportEmail: process.env.SUPPORT_EMAIL ?? "support@rightbricks.online",
    opsEmail: process.env.OPS_EMAIL ?? "ops@rightbricks.online",
    alertsEnabled: (process.env.ALERTS_ENABLED ?? "true") === "true",
    maintenanceMode: (process.env.MAINTENANCE_MODE ?? "false") === "true",
  };
}

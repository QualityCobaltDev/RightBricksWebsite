import { RoleCode } from "@prisma/client";
import { forbidden } from "@/lib/errors";

export type Permission =
  | "listing:create"
  | "listing:update"
  | "listing:moderate"
  | "search:save"
  | "inquiry:create"
  | "viewing:create"
  | "cms:write"
  | "audit:read"
  | "admin:access";

const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  SUPER_ADMIN: [
    "listing:create",
    "listing:update",
    "listing:moderate",
    "search:save",
    "inquiry:create",
    "viewing:create",
    "cms:write",
    "audit:read",
    "admin:access",
  ],
  ADMIN: [
    "listing:create",
    "listing:update",
    "listing:moderate",
    "search:save",
    "inquiry:create",
    "viewing:create",
    "cms:write",
    "audit:read",
    "admin:access",
  ],
  MODERATOR: ["listing:moderate", "admin:access"],
  SUPPORT: ["admin:access", "inquiry:create", "viewing:create"],
  CONTENT_EDITOR: ["cms:write", "admin:access"],
  AGENT: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save"],
  AGENCY_ADMIN: [
    "listing:create",
    "listing:update",
    "inquiry:create",
    "viewing:create",
    "search:save",
    "admin:access",
  ],
  DEVELOPER_ADMIN: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "admin:access"],
  OWNER: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save"],
  LANDLORD: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save"],
  SEEKER: ["search:save", "inquiry:create", "viewing:create"],
};

export function assertPermission(roles: RoleCode[], permission: Permission) {
  const allowed = roles.some((role) => ROLE_PERMISSIONS[role]?.includes(permission));
  if (!allowed) {
    throw forbidden(`Missing permission: ${permission}`);
  }
}

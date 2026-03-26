import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { RoleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth";

export async function requireDashboardAccess(allowedRoles: RoleCode[]) {
  const token = (await cookies()).get("rb_access_token")?.value;
  if (!token) redirect("/login");

  const decoded = await verifyAccessToken(token);
  const user = await prisma.user.findFirst({
    where: { id: decoded.userId, deletedAt: null },
    include: { roles: { include: { role: true } } },
  });

  if (!user) redirect("/login");

  const roles = user.roles.map((r) => r.role.code);
  const allowed = roles.some((role) => allowedRoles.includes(role));

  if (!allowed) redirect("/unauthorized");

  return {
    user,
    roles,
  };
}

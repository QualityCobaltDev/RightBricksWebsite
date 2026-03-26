import { RoleCode } from "@prisma/client";
import { conflict, unauthorized } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAccessToken, verifyPassword } from "@/lib/auth";
import { auditLog } from "@/lib/audit";

export async function registerUser(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  preferredLocale: "EN" | "KM";
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing && !existing.deletedAt) throw conflict("Email already registered");

  const role = await prisma.role.findUnique({ where: { code: RoleCode.SEEKER } });
  if (!role) throw conflict("SEEKER role not seeded");

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: await hashPassword(input.password),
      firstName: input.firstName,
      lastName: input.lastName,
      preferredLocale: input.preferredLocale,
      status: "ACTIVE",
      roles: { create: [{ roleId: role.id }] },
    },
    include: { roles: { include: { role: true } } },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: user.id,
    action: "auth.register",
    entityType: "User",
    entityId: user.id,
  });

  const token = await signAccessToken({
    userId: user.id,
    email: user.email,
    roles: user.roles.map((r) => r.role.code),
  });

  return { user, token };
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await prisma.user.findFirst({
    where: { email: input.email, deletedAt: null },
    include: { roles: { include: { role: true } } },
  });

  if (!user?.passwordHash) throw unauthorized("Invalid credentials");
  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) throw unauthorized("Invalid credentials");

  const token = await signAccessToken({
    userId: user.id,
    email: user.email,
    roles: user.roles.map((r) => r.role.code),
  });

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  await auditLog({
    actorType: "USER",
    actorUserId: user.id,
    action: "auth.login",
    entityType: "User",
    entityId: user.id,
  });

  return { user, token };
}

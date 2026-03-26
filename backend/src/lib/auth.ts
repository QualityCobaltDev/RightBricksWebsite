import argon2 from "argon2";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { RoleCode } from "@prisma/client";
import { env } from "@/config/env";
import { prisma } from "@/lib/prisma";
import { unauthorized } from "@/lib/errors";

export type AuthContext = {
  userId: string;
  email: string;
  roles: RoleCode[];
};

const secret = new TextEncoder().encode(env.JWT_SECRET);

export async function hashPassword(password: string) {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

export async function signAccessToken(context: AuthContext) {
  const payload: JWTPayload = {
    sub: context.userId,
    email: context.email,
    roles: context.roles,
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(env.JWT_ISSUER)
    .setAudience(env.JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${env.JWT_ACCESS_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret, {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  if (!payload.sub || typeof payload.email !== "string") {
    throw unauthorized();
  }

  const roles = Array.isArray(payload.roles) ? (payload.roles as RoleCode[]) : [];

  return {
    userId: payload.sub,
    email: payload.email,
    roles,
  };
}

export async function requireAuth(request: NextRequest): Promise<AuthContext> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    throw unauthorized("Missing bearer token");
  }

  const token = authorization.slice(7);
  const decoded = await verifyAccessToken(token);

  const user = await prisma.user.findFirst({
    where: { id: decoded.userId, deletedAt: null },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    throw unauthorized("User not found");
  }

  return {
    userId: user.id,
    email: user.email,
    roles: user.roles.map((r) => r.role.code),
  };
}

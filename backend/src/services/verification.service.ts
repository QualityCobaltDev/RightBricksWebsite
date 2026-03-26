import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function submitVerificationRequest(input: {
  userId?: string;
  organizationId?: string;
  requestedType: string;
  documentStorageKey?: string;
}) {
  const request = await prisma.verificationRequest.create({
    data: {
      userId: input.userId,
      organizationId: input.organizationId,
      requestedType: input.requestedType,
      documentStorageKey: input.documentStorageKey,
      status: "PENDING",
    },
  });

  await auditLog({
    actorType: input.userId ? "USER" : "SYSTEM",
    actorUserId: input.userId,
    action: "verification.submit",
    entityType: "VerificationRequest",
    entityId: request.id,
    afterJson: request,
  });

  return request;
}

export async function getVerificationStatuses(userId: string) {
  const [userRequests, orgRequests] = await Promise.all([
    prisma.verificationRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.verificationRequest.findMany({
      where: { organization: { members: { some: { userId } } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return { userRequests, orgRequests };
}

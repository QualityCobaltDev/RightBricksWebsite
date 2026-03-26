import { AuditActorType, AuditSeverity } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function auditLog(input: {
  actorType: AuditActorType;
  actorUserId?: string;
  actorLabel?: string;
  action: string;
  entityType: string;
  entityId: string;
  severity?: AuditSeverity;
  ipAddress?: string;
  userAgent?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
  metadataJson?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorType: input.actorType,
      actorUserId: input.actorUserId,
      actorLabel: input.actorLabel,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      severity: input.severity,
      ipAddress: input.ipAddress,
      userAgent: input.userAgent,
      beforeJson: input.beforeJson as object | undefined,
      afterJson: input.afterJson as object | undefined,
      metadataJson: input.metadataJson as object | undefined,
    },
  });
}

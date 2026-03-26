import { ModerationActionType, ModerationCaseStatus, ReportStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/errors";
import { auditLog } from "@/lib/audit";

export async function reportListing(input: {
  listingId: string;
  reporterId?: string;
  reasonCode: string;
  description?: string;
}) {
  const report = await prisma.abuseReport.create({
    data: {
      targetType: "LISTING",
      listingId: input.listingId,
      reporterId: input.reporterId,
      reasonCode: input.reasonCode,
      description: input.description,
    },
  });

  const moderationCase = await prisma.moderationCase.create({
    data: {
      listingId: input.listingId,
      abuseReportId: report.id,
      openedById: input.reporterId,
      status: "OPEN",
      priority: 3,
    },
  });

  await auditLog({
    actorType: input.reporterId ? "USER" : "SYSTEM",
    actorUserId: input.reporterId,
    action: "abuse_report.create",
    entityType: "AbuseReport",
    entityId: report.id,
    afterJson: { report, moderationCase },
  });

  return { report, moderationCase };
}

export async function listModerationCases(status?: ModerationCaseStatus) {
  return prisma.moderationCase.findMany({
    where: { status: status ?? undefined },
    include: {
      listing: { include: { translations: true, owner: true, organization: true } },
      abuseReport: true,
      assignedModerator: true,
      notes: { include: { author: true }, orderBy: { createdAt: "desc" }, take: 5 },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    take: 200,
  });
}

export async function getModerationCaseById(caseId: string) {
  const record = await prisma.moderationCase.findUnique({
    where: { id: caseId },
    include: {
      listing: { include: { translations: true, owner: true, organization: true, abuseReports: true } },
      abuseReport: true,
      assignedModerator: true,
      openedBy: true,
      notes: { include: { author: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!record) throw notFound("Moderation case not found");
  return record;
}

export async function moderateCaseAction(input: {
  caseId: string;
  moderatorId: string;
  action: ModerationActionType;
  reasonCode?: string;
  note?: string;
}) {
  const current = await prisma.moderationCase.findUnique({ where: { id: input.caseId }, include: { abuseReport: true } });
  if (!current) throw notFound("Moderation case not found");

  const mappedStatus = input.action === "REQUEST_CHANGES" ? "INVESTIGATING" : "ACTIONED";

  const updated = await prisma.moderationCase.update({
    where: { id: input.caseId },
    data: {
      assignedModeratorId: input.moderatorId,
      decision: input.action,
      decisionReasonCode: input.reasonCode,
      status: mappedStatus,
      decisionAt: new Date(),
      closedAt: mappedStatus === "ACTIONED" ? new Date() : null,
    },
  });

  if (current.abuseReportId) {
    await prisma.abuseReport.update({
      where: { id: current.abuseReportId },
      data: { status: mappedStatus === "ACTIONED" ? ReportStatus.ACTION_TAKEN : ReportStatus.IN_REVIEW },
    });
  }

  if (input.note) {
    await prisma.moderationNote.create({
      data: {
        caseId: input.caseId,
        authorId: input.moderatorId,
        body: input.note,
      },
    });
  }

  await auditLog({
    actorType: "USER",
    actorUserId: input.moderatorId,
    action: "moderation.case.action",
    entityType: "ModerationCase",
    entityId: input.caseId,
    beforeJson: current,
    afterJson: updated,
  });

  return updated;
}

export async function addModerationNote(input: {
  caseId: string;
  authorId: string;
  body: string;
  isInternal?: boolean;
}) {
  const note = await prisma.moderationNote.create({
    data: {
      caseId: input.caseId,
      authorId: input.authorId,
      body: input.body,
      isInternal: input.isInternal ?? true,
    },
    include: { author: true },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: input.authorId,
    action: "moderation.note.create",
    entityType: "ModerationCase",
    entityId: input.caseId,
    afterJson: note,
  });

  return note;
}

import { InquirySource, LocaleCode } from "@prisma/client";
import { badRequest } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function createInquiry(input: {
  createdById?: string;
  listingId?: string;
  projectId?: string;
  source: InquirySource;
  name: string;
  email?: string;
  phoneE164?: string;
  message?: string;
  preferredLocale?: LocaleCode;
}) {
  if (!input.listingId && !input.projectId) {
    throw badRequest("Either listingId or projectId is required");
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      createdById: input.createdById,
      listingId: input.listingId,
      projectId: input.projectId,
      source: input.source,
      name: input.name,
      email: input.email,
      phoneE164: input.phoneE164,
      message: input.message,
      preferredLocale: input.preferredLocale ?? LocaleCode.EN,
    },
  });

  await auditLog({
    actorType: input.createdById ? "USER" : "SYSTEM",
    actorUserId: input.createdById,
    action: "inquiry.create",
    entityType: "Inquiry",
    entityId: inquiry.id,
    afterJson: inquiry,
  });

  return inquiry;
}

export async function createMessageThread(input: {
  inquiryId?: string;
  listingId?: string;
  participantAId: string;
  participantBId: string;
}) {
  return prisma.messageThread.create({
    data: {
      inquiryId: input.inquiryId,
      listingId: input.listingId,
      participantAId: input.participantAId,
      participantBId: input.participantBId,
    },
  });
}

export async function sendMessage(input: { threadId: string; senderId: string; body: string }) {
  const message = await prisma.message.create({
    data: {
      threadId: input.threadId,
      senderId: input.senderId,
      body: input.body,
    },
  });

  await prisma.messageThread.update({
    where: { id: input.threadId },
    data: { lastMessageAt: new Date() },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: input.senderId,
    action: "message.send",
    entityType: "Message",
    entityId: message.id,
    afterJson: message,
  });

  return message;
}

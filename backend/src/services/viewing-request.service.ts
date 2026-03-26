import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function createViewingRequest(input: {
  requesterId: string;
  listingId: string;
  requestedAt: Date;
  note?: string;
}) {
  const request = await prisma.viewingRequest.create({
    data: {
      requesterId: input.requesterId,
      listingId: input.listingId,
      requestedAt: input.requestedAt,
      note: input.note,
    },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: input.requesterId,
    action: "viewing_request.create",
    entityType: "ViewingRequest",
    entityId: request.id,
    afterJson: request,
  });

  return request;
}

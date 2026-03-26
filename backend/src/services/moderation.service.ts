import { ModerationDecision } from "@prisma/client";
import { notFound } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function moderateListing(input: {
  listingId: string;
  moderatorId: string;
  decision: ModerationDecision;
  reasonCode?: string;
  notes?: string;
}) {
  const listing = await prisma.listing.findFirst({ where: { id: input.listingId, deletedAt: null } });
  if (!listing) throw notFound("Listing not found");

  const mappedStatus =
    input.decision === "APPROVED"
      ? "PUBLISHED"
      : input.decision === "REJECTED"
        ? "REJECTED"
        : "CHANGES_REQUESTED";

  const updated = await prisma.listing.update({
    where: { id: input.listingId },
    data: {
      status: mappedStatus,
      publishedAt: input.decision === "APPROVED" ? new Date() : listing.publishedAt,
    },
  });

  const moderation = await prisma.moderationAction.create({
    data: {
      listingId: input.listingId,
      moderatorId: input.moderatorId,
      decision: input.decision,
      reasonCode: input.reasonCode,
      notes: input.notes,
    },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: input.moderatorId,
    action: "listing.moderate",
    entityType: "Listing",
    entityId: input.listingId,
    beforeJson: listing,
    afterJson: updated,
    metadataJson: moderation,
  });

  return { updated, moderation };
}

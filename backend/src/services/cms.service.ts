import { LocaleCode } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auditLog } from "@/lib/audit";

export async function createArticle(input: {
  userId: string;
  slug: string;
  category: string;
  canonicalUrl: string;
  titleEn: string;
  bodyEn: string;
  titleKm?: string;
  bodyKm?: string;
  publishNow?: boolean;
}) {
  const article = await prisma.cmsArticle.create({
    data: {
      slug: input.slug,
      category: input.category,
      canonicalUrl: input.canonicalUrl,
      status: input.publishNow ? "PUBLISHED" : "DRAFT",
      publishedAt: input.publishNow ? new Date() : null,
      createdById: input.userId,
      updatedById: input.userId,
      translations: {
        create: [
          { locale: LocaleCode.EN, title: input.titleEn, body: input.bodyEn },
          ...(input.titleKm && input.bodyKm
            ? [{ locale: LocaleCode.KM, title: input.titleKm, body: input.bodyKm }]
            : []),
        ],
      },
    },
    include: { translations: true },
  });

  await auditLog({
    actorType: "USER",
    actorUserId: input.userId,
    action: "cms.article.create",
    entityType: "CmsArticle",
    entityId: article.id,
    afterJson: article,
  });

  return article;
}

export async function listPublishedArticles() {
  return prisma.cmsArticle.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    include: { translations: true },
    orderBy: { publishedAt: "desc" },
  });
}

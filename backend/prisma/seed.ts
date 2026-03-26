import { PrismaClient, RoleCode } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const permissionCodes = [
  "listing:create",
  "listing:update",
  "listing:moderate",
  "search:save",
  "inquiry:create",
  "viewing:create",
  "cms:write",
  "audit:read",
  "admin:access",
];

const rolePermissionMap: Record<RoleCode, string[]> = {
  SUPER_ADMIN: permissionCodes,
  ADMIN: permissionCodes,
  MODERATOR: ["listing:moderate", "admin:access"],
  SUPPORT: ["admin:access", "inquiry:create", "viewing:create"],
  CONTENT_EDITOR: ["cms:write", "admin:access"],
  AGENT: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save"],
  AGENCY_ADMIN: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save", "admin:access"],
  DEVELOPER_ADMIN: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "admin:access"],
  OWNER: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save"],
  LANDLORD: ["listing:create", "listing:update", "inquiry:create", "viewing:create", "search:save"],
  SEEKER: ["search:save", "inquiry:create", "viewing:create"],
};

async function main() {
  for (const code of permissionCodes) {
    await prisma.permission.upsert({ where: { code }, update: {}, create: { code } });
  }

  for (const roleCode of Object.values(RoleCode)) {
    const role = await prisma.role.upsert({
      where: { code: roleCode },
      update: {},
      create: {
        code: roleCode,
        name: roleCode,
        isSystem: true,
      },
    });

    for (const permissionCode of rolePermissionMap[roleCode]) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { code: permissionCode } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  const country = await prisma.country.upsert({
    where: { iso2: "KH" },
    update: {},
    create: { iso2: "KH", nameEn: "Cambodia", nameKm: "កម្ពុជា" },
  });

  const phnomPenh = await prisma.province.upsert({
    where: { countryId_slug: { countryId: country.id, slug: "phnom-penh" } },
    update: {},
    create: {
      countryId: country.id,
      code: "12",
      slug: "phnom-penh",
      nameEn: "Phnom Penh",
      nameKm: "ភ្នំពេញ",
    },
  });

  const chamkarMon = await prisma.district.upsert({
    where: { provinceId_slug: { provinceId: phnomPenh.id, slug: "chamkar-mon" } },
    update: {},
    create: {
      provinceId: phnomPenh.id,
      code: "1201",
      slug: "chamkar-mon",
      nameEn: "Chamkar Mon",
      nameKm: "ចំការមន",
    },
  });

  await prisma.commune.upsert({
    where: { districtId_slug: { districtId: chamkarMon.id, slug: "tonle-bassac" } },
    update: {},
    create: {
      districtId: chamkarMon.id,
      code: "120101",
      slug: "tonle-bassac",
      nameEn: "Tonle Bassac",
      nameKm: "ទន្លេបាសាក់",
    },
  });

  const daunPenh = await prisma.district.upsert({
    where: { provinceId_slug: { provinceId: phnomPenh.id, slug: "daun-penh" } },
    update: {},
    create: {
      provinceId: phnomPenh.id,
      code: "1202",
      slug: "daun-penh",
      nameEn: "Daun Penh",
      nameKm: "ដូនពេញ",
    },
  });

  await prisma.commune.upsert({
    where: { districtId_slug: { districtId: daunPenh.id, slug: "phsar-kandal-ti-muoy" } },
    update: {},
    create: {
      districtId: daunPenh.id,
      code: "120201",
      slug: "phsar-kandal-ti-muoy",
      nameEn: "Phsar Kandal I",
      nameKm: "ផ្សារកណ្ដាលទី១",
    },
  });

  await prisma.amenity.upsert({
    where: { code: "AIR_CONDITIONING" },
    update: {},
    create: { code: "AIR_CONDITIONING", nameEn: "Air Conditioning", nameKm: "ម៉ាស៊ីនត្រជាក់", category: "comfort" },
  });
  await prisma.amenity.upsert({
    where: { code: "SECURITY_24_7" },
    update: {},
    create: { code: "SECURITY_24_7", nameEn: "24/7 Security", nameKm: "សន្តិសុខ ២៤/៧", category: "security" },
  });
  await prisma.amenity.upsert({
    where: { code: "PARKING" },
    update: {},
    create: { code: "PARKING", nameEn: "Parking", nameKm: "ចំណតរថយន្ត", category: "mobility" },
  });

  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (superAdminEmail && superAdminPassword) {
    const hash = await argon2.hash(superAdminPassword, { type: argon2.argon2id });
    const user = await prisma.user.upsert({
      where: { email: superAdminEmail },
      update: { passwordHash: hash, status: "ACTIVE" },
      create: {
        email: superAdminEmail,
        passwordHash: hash,
        firstName: "RightBricks",
        lastName: "Admin",
        preferredLocale: "EN",
        status: "ACTIVE",
      },
    });

    const role = await prisma.role.findUniqueOrThrow({ where: { code: "SUPER_ADMIN" } });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: role.id } },
      update: {},
      create: { userId: user.id, roleId: role.id },
    });
  }

  await prisma.currencyRate.upsert({
    where: {
      baseCode_quoteCode_asOfDate: {
        baseCode: "USD",
        quoteCode: "KHR",
        asOfDate: new Date("2026-01-01T00:00:00.000Z"),
      },
    },
    update: { rate: "4100" },
    create: {
      baseCode: "USD",
      quoteCode: "KHR",
      asOfDate: new Date("2026-01-01T00:00:00.000Z"),
      rate: "4100",
      source: "seed",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

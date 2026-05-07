import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding Database...");

  // 🏢 1. Clear Data
  await prisma.user.deleteMany();
  await prisma.team.deleteMany();
  await prisma.department.deleteMany();
  await prisma.role.deleteMany();
  await prisma.tenant.deleteMany();

  // 🏢 2. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: "WhatSaaS Official",
      slug: "whatsaas",
    },
  });

  // 🛡️ 3. Create Roles
  const adminRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: "Admin",
      permissions: ["USERS_VIEW", "USERS_CREATE", "USERS_DELETE", "DEPARTMENTS_MANAGE"],
    },
  });

  const viewerRole = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      name: "Viewer",
      permissions: ["USERS_VIEW"],
    },
  });

  // 🏗️ 4. Create Departments & Teams
  const salesDept = await prisma.department.create({
    data: {
      tenantId: tenant.id,
      name: "قسم المبيعات",
      slug: "sales",
    },
  });

  const supportDept = await prisma.department.create({
    data: {
      tenantId: tenant.id,
      name: "الدعم الفني",
      slug: "support",
    },
  });

  await prisma.team.createMany({
    data: [
      { departmentId: salesDept.id, name: "فريق الإغلاق (Closers)" },
      { departmentId: salesDept.id, name: "فريق التنقيب (Prospecting)" },
      { departmentId: supportDept.id, name: "الدعم التقني" },
    ],
  });

  const salesTeam = await prisma.team.findFirst({ where: { name: "فريق الإغلاق (Closers)" } });

  // 👤 5. Create Users
  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      roleId: adminRole.id,
      departmentId: salesDept.id,
      teamId: salesTeam?.id,
      name: "د. محمد الأحمد",
      email: "dr.mohamad@whatsaas.com",
      passwordHash: "hash_123",
    },
  });

  await prisma.user.create({
    data: {
      tenantId: tenant.id,
      roleId: viewerRole.id,
      departmentId: supportDept.id,
      name: "المشاهد العام",
      email: "viewer@whatsaas.com",
      passwordHash: "hash_123",
    },
  });

  console.log("✅ Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

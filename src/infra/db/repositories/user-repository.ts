import { prisma } from "../prisma";

export const UserRepository = {
  // 🔍 Get all users with their roles for a specific tenant
  async getAllUsers(tenantId: string) {
    return await prisma.user.findMany({
      where: { tenantId },
      include: { role: true },
    });
  },

  // ➕ Create a new user
  async createUser(data: any) {
    return await prisma.user.create({
      data,
    });
  },

  // 🛡️ Get or Create Default Tenant/Role (For Seeding)
  async ensureBaseInfrastructure() {
    let tenant = await prisma.tenant.findFirst();
    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          name: "Academic Institution",
          slug: "academic-mongo",
        },
      });
    }

    let adminRole = await prisma.role.findFirst({
      where: { name: "Admin", tenantId: tenant.id }
    });

    if (!adminRole) {
      adminRole = await prisma.role.create({
        data: {
          tenantId: tenant.id,
          name: "Admin",
          permissions: ["*"],
        },
      });
    }

    return { tenantId: tenant.id, roleId: adminRole.id };
  }
};

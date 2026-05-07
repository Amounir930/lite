"use server";

import { prisma } from "@/infra/db/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/infra/auth/session";

const toObjectId = (id: string) => ({ $oid: id });

// 🛡️ USER MANAGEMENT ACTIONS
export async function deleteUserAction(userId: string) {
  try {
    const prismaAny = prisma as any;
    await prismaAny.$runCommandRaw({
      delete: "User",
      deletes: [{ q: { _id: toObjectId(userId) }, limit: 1 }]
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "فشل حذف الموظف." };
  }
}

export async function updateUserAction(userId: string, data: any) {
  try {
    const prismaAny = prisma as any;
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.roleId) updateData.roleId = data.roleId;
    if (data.departmentId) updateData.departmentId = data.departmentId;
    if (data.password) updateData.passwordHash = data.password;

    await prismaAny.$runCommandRaw({
      update: "User",
      updates: [{
        q: { _id: toObjectId(userId) },
        u: { $set: { ...updateData, updatedAt: new Date().toISOString() } }
      }]
    });

    revalidatePath("/admin/users");
    return { success: true };
  } catch (error) {
    return { error: "فشل تحديث بيانات الموظف." };
  }
}

export async function createUserAction(formData: FormData) {
  const session = await getSession();
  if (!session.tenantId) return { error: "الجلسة منتهية." };

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const roleId = formData.get("roleId") as string;
  const departmentId = formData.get("departmentId") as string;

  try {
    const prismaAny = prisma as any;
    await prismaAny.$runCommandRaw({
      insert: "User",
      documents: [{
        tenantId: session.tenantId,
        name,
        email,
        passwordHash: password,
        roleId,
        departmentId,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    });
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    return { error: "فشل الحفظ." };
  }
}

// 🛡️ DEPARTMENT ACTIONS
export async function createTeamAction(departmentId: string, name: string) {
  try {
    const prismaAny = prisma as any;
    if (prismaAny.team) {
      await prismaAny.team.create({
        data: { departmentId, name }
      });
    } else {
      await prismaAny.$runCommandRaw({
        insert: "Team",
        documents: [{ departmentId: toObjectId(departmentId), name, createdAt: new Date().toISOString() }]
      });
    }
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error) {
    return { error: "فشل إنشاء الفريق." };
  }
}

export async function createDepartmentAction(name: string, slug: string) {
  const session = await getSession();
  try {
    const prismaAny = prisma as any;
    await prismaAny.$runCommandRaw({
      insert: "Department",
      documents: [{ tenantId: session.tenantId, name, slug: (slug || name).toLowerCase().replace(/\s+/g, "-"), createdAt: new Date().toISOString() }]
    });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error) { return { error: "فشل الإنشاء." }; }
}

export async function updateDepartmentAction(deptId: string, data: any) {
  try {
    const prismaAny = prisma as any;
    await prismaAny.$runCommandRaw({
      update: "Department",
      updates: [{
        q: { _id: toObjectId(deptId) },
        u: { $set: { name: data.name, updatedAt: new Date().toISOString() } }
      }]
    });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error) { return { error: "فشل التحديث." }; }
}

export async function deleteDepartmentAction(deptId: string) {
  try {
    const prismaAny = prisma as any;
    await prismaAny.$runCommandRaw({ delete: "Department", deletes: [{ q: { _id: toObjectId(deptId) }, limit: 1 }] });
    revalidatePath("/admin/departments");
    return { success: true };
  } catch (error) { return { error: "فشل الحذف." }; }
}

// 🛡️ ROLE ACTIONS
export async function updateRolePermissionsAction(roleId: string, permissions: string[]) {
  try {
    await prisma.role.update({ where: { id: roleId }, data: { permissions } });
    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) { return { error: "فشل التحديث." }; }
}

export async function deleteRoleAction(roleId: string) {
  try {
    await prisma.role.delete({ where: { id: roleId } });
    revalidatePath("/admin/roles");
    return { success: true };
  } catch (error) { return { error: "فشل الحذف." }; }
}

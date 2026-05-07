"use server";

import { prisma } from "@/infra/db/prisma";
import { getSession } from "@/infra/auth/session";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = formData.get("locale") as string || "ar";

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || password !== user.passwordHash) {
      return { error: "بيانات الاعتماد غير صحيحة." };
    }

    const session = await getSession();
    session.userId = user.id;
    session.tenantId = user.tenantId;
    session.role = user.role?.name || "User";
    session.permissions = user.role?.permissions || [];
    session.isLoggedIn = true;
    await session.save();
  } catch (err) {
    return { error: "حدث خطأ في النظام." };
  }

  redirect(`/${locale}/dashboard`);
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  // Redirect happens on client side for better control
  return { success: true };
}

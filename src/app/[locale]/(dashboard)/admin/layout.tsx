import { getTranslations } from "next-intl/server";
import { getSession } from "@/infra/auth/session";
import { redirect } from "next/navigation";
import { AdminTabs } from "@/components/layout/AdminTabs";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Admin");
  const session = await getSession();

  // 🛡️ Security Guard: Only Admins can enter
  if (session.role !== "Admin" && session.role !== "Super Admin") {
    redirect(`/${locale}/dashboard`);
  }

  // 🔑 Pass icon names as STRINGS to avoid Next.js 15 serialization errors
  const tabs = [
    { name: t("users_tab"), href: `/admin/users`, iconName: "Users" as const },
    { name: t("depts_tab"), href: `/admin/departments`, iconName: "Building2" as const },
    { name: t("roles_tab"), href: `/admin/roles`, iconName: "ShieldLock" as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 🏛️ Admin Header */}
      <div className="text-start">
        <h1 className="text-4xl font-bold tracking-tight text-text-main">{t("title")}</h1>
        <p className="text-text-muted mt-2">{t("description")}</p>
      </div>

      {/* 📑 Navigation Tabs (Stable Client Component) */}
      <AdminTabs tabs={tabs} />

      {/* 🚀 Tab Content */}
      <div className="mt-8">
        {children}
      </div>
    </div>
  );
}

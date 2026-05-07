import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { getLocale } from "next-intl/server";
import { getSession } from "@/infra/auth/session";
import { prisma } from "@/infra/db/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const isRtl = locale === "ar";
  const session = await getSession();

  // 🛡️ Fetch user role and permissions for Sidebar filtering
  let userPermissions: string[] = [];
  let roleName = "Guest";

  if (session.isLoggedIn && session.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true }
    });
    userPermissions = user?.role?.permissions || [];
    roleName = user?.role?.name || "Guest";
  }

  return (
    <div className="flex min-h-screen bg-bg-base overflow-x-hidden">
      {/* 🧭 Sidebar - Now with real permissions */}
      <Sidebar userPermissions={userPermissions} roleName={roleName} />

      {/* 🚀 Main Content Area */}
      <div className={`flex flex-1 flex-col min-w-0 transition-all duration-300`}>
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 pt-4">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

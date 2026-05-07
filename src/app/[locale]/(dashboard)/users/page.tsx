import { getTranslations } from "next-intl/server";
import { UserPlus, MoreVertical, ShieldCheck, Database, Lock } from "lucide-react";
import { UserRepository } from "@/infra/db/repositories/user-repository";
import { hasPermission } from "@/lib/rbac";

export default async function UsersPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations("Users");
  
  let usersList: any[] = [];
  let currentUser = null;

  try {
    const { tenantId } = await UserRepository.ensureBaseInfrastructure();
    usersList = await UserRepository.getAllUsers(tenantId);
    currentUser = usersList[0]; 
  } catch (error) {
    console.error("DB Connection Failed");
  }

  const currentUserPermissions = currentUser?.role?.permissions || [];
  const canCreate = hasPermission(currentUserPermissions, "USERS_CREATE");
  const userRoleName = currentUser?.role?.name || "Guest";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 🧭 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-bold tracking-tight text-text-main">{t("title")}</h1>
          <div className="flex flex-col gap-2 mt-3">
            <p className="text-text-muted flex items-center gap-2 text-sm">
              <Database size={14} className="text-primary" />
              <span>{t("database_info")}</span>
            </p>
            <div className="flex items-center gap-3 rounded-2xl bg-primary/5 border border-primary/10 p-3 w-fit">
              <Lock size={14} className="text-orange-500" />
              <span className="text-xs text-text-muted">
                {t("your_role")}: <b className="text-primary">{userRoleName}</b>
                <span className="font-mono ml-2 opacity-60">[{currentUserPermissions.join(", ")}]</span>
              </span>
            </div>
          </div>
        </div>
        
        {canCreate && (
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95">
            <UserPlus size={18} />
            <span>{t("add_user")}</span>
          </button>
        )}
      </div>

      {/* 📂 User Table */}
      <div className="soft-card overflow-hidden border-border-subtle">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-start border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface/50">
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-text-muted font-mono text-start">{t("table_user")}</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-text-muted font-mono text-start">{t("table_role")}</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-text-muted font-mono text-start">{t("table_permissions")}</th>
                <th className="px-8 py-5 text-xs uppercase tracking-widest text-text-muted font-mono text-end">{t("table_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold uppercase border border-primary/10 shadow-sm">
                        {user.name[0]}
                      </div>
                      <div className="text-start">
                        <p className="text-sm font-bold text-text-main">{user.name}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-primary/5 border border-primary/10 px-3 py-1.5 text-[11px] font-bold text-primary">
                      <ShieldCheck size={14} />
                      <span>{user.role?.name || "Guest"}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5 max-w-[300px]">
                      {user.role?.permissions.map((p: string) => (
                        <span key={p} className="text-[10px] font-mono bg-bg-surface px-2 py-0.5 rounded-lg border border-border-subtle text-text-muted">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-end">
                    <button className="p-2.5 rounded-xl hover:bg-bg-surface border border-transparent hover:border-border-subtle text-text-muted transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

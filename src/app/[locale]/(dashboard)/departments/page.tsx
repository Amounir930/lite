import { getTranslations } from "next-intl/server";
import { Building2, Users, ArrowRight, Plus, FolderTree } from "lucide-react";
import { prisma } from "@/infra/db/prisma";
import { getSession } from "@/infra/auth/session";

export default async function DepartmentsPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations("Departments");
  const session = await getSession();

  // 🔍 Fetch Departments with Teams and User counts
  const departments = await prisma.department.findMany({
    where: { tenantId: session.tenantId },
    include: {
      teams: true,
      _count: {
        select: { users: true }
      }
    }
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* 🧭 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <FolderTree className="text-primary" size={36} />
            {t("title")}
          </h1>
          <p className="text-text-muted mt-2 text-lg">{t("description")}</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95">
          <Plus size={20} />
          <span>{t("add_department")}</span>
        </button>
      </div>

      {/* 🏢 Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {departments.map((dept) => (
          <div key={dept.id} className="soft-card group hover:border-primary/20 transition-all p-0 overflow-hidden">
            <div className="p-8 border-b border-border-subtle bg-bg-surface/50">
              <div className="flex items-center justify-between mb-6">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                  <Building2 size={28} />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg-surface border border-border-subtle text-text-muted text-xs font-bold">
                  <Users size={14} />
                  <span>{dept._count.users} {t("members")}</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text-main mb-2">{dept.name}</h3>
              <p className="text-xs font-mono text-text-muted uppercase tracking-widest">ID: {dept.slug}</p>
            </div>

            <div className="p-8 space-y-4">
              <h4 className="text-sm font-bold text-text-muted uppercase tracking-tighter flex items-center gap-2">
                {t("teams")} ({dept.teams.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {dept.teams.map((team) => (
                  <div key={team.id} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-base border border-border-subtle text-sm text-text-main hover:border-primary/30 transition-all cursor-default">
                    <div className="size-1.5 rounded-full bg-primary"></div>
                    {team.name}
                  </div>
                ))}
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border-subtle text-xs text-text-muted hover:border-primary/30 hover:text-primary transition-all">
                  <Plus size={14} />
                  {t("add_team")}
                </button>
              </div>
            </div>

            <div className="px-8 py-5 bg-primary/5 flex items-center justify-between group-hover:bg-primary/10 transition-colors">
              <span className="text-xs font-bold text-primary">{t("view_details")}</span>
              <ArrowRight size={16} className="text-primary transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

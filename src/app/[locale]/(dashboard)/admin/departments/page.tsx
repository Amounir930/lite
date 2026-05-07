import { Building2, Users, FolderTree, ArrowRight } from "lucide-react";
import { prisma } from "@/infra/db/prisma";
import { getSession } from "@/infra/auth/session";
import { AddDeptModal } from "@/components/layout/AddDeptModal";
import { EditDeptModal } from "@/components/layout/EditDeptModal";
import { AddTeamModal } from "@/components/layout/AddTeamModal";

export default async function DepartmentsPage() {
  const session = await getSession();

  let departments: any[] = [];
  try {
    const prismaAny = prisma as any;
    if (prismaAny.department) {
      departments = await prismaAny.department.findMany({
        where: { tenantId: session.tenantId },
        include: { teams: true, _count: { select: { users: true } } }
      });
    }

    if (departments.length === 0) {
      const rawDepts: any = await prismaAny.$runCommandRaw({
        find: "Department",
        filter: { tenantId: session.tenantId }
      });
      if (rawDepts.cursor?.firstBatch) {
        departments = rawDepts.cursor.firstBatch;
        // Fetch teams for each raw dept
        for (let d of departments) {
          const rawTeams: any = await prismaAny.$runCommandRaw({
            find: "Team",
            filter: { departmentId: d._id }
          });
          d.teams = rawTeams.cursor?.firstBatch || [];
        }
      }
    }
  } catch (error) { console.error("Fetch Error"); }

  const getSafeId = (dept: any) => {
    if (typeof dept.id === 'string') return dept.id;
    if (dept._id && typeof dept._id === 'object' && dept._id.$oid) return dept._id.$oid;
    if (dept._id && typeof dept._id === 'string') return dept._id;
    return Math.random().toString();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-text-main flex items-center gap-4">
            <FolderTree className="text-primary" size={36} />
            الهيكل التنظيمي (Departments & Teams)
          </h2>
          <p className="text-text-muted mt-2 text-lg">تحكم كامل في الأقسام والفرق الفرعية.</p>
        </div>
        <AddDeptModal />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {departments.map((dept: any) => {
          const deptId = getSafeId(dept);
          return (
            <div key={deptId} className="soft-card group hover:border-primary/20 transition-all p-0 overflow-hidden text-start bg-bg-surface/30 backdrop-blur-sm relative">
              <div className="p-8 border-b border-border-subtle bg-bg-surface/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-inner">
                    <Building2 size={28} />
                  </div>
                  <div className="flex gap-2">
                    <AddTeamModal departmentId={deptId} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-2">{dept.name}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold text-text-muted">
                  <span className="flex items-center gap-1"><Users size={12} /> {dept._count?.users || 0} موظف</span>
                  <span className="px-2 py-0.5 rounded bg-bg-base border border-border-subtle uppercase tracking-widest font-mono">REF: {deptId.substring(0, 8)}</span>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest">الفرق الفرعية ({dept.teams?.length || 0})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dept.teams?.length > 0 ? dept.teams.map((team: any) => (
                    <div key={team.id || Math.random()} className="flex items-center justify-between p-3 rounded-xl bg-bg-base border border-border-subtle hover:border-primary/40 transition-colors group/team">
                      <div className="flex items-center gap-3">
                        <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-bold text-text-main">{team.name}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-2 py-8 text-center border-2 border-dashed border-border-subtle rounded-2xl">
                      <p className="text-xs text-text-muted italic">لا توجد فرق فرعية مضافة.</p>
                    </div>
                  )}
                </div>
              </div>

              <EditDeptModal dept={dept} deptId={deptId} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Mail, Shield, Building2, MoreVertical, CheckCircle2 } from "lucide-react";
import { prisma } from "@/infra/db/prisma";
import { getSession } from "@/infra/auth/session";
import dynamic from "next/dynamic";

const AddUserModal = dynamic(() => import("@/components/layout/AddUserModal").then(m => m.AddUserModal));
const EditUserModal = dynamic(() => import("@/components/layout/EditUserModal").then(m => m.EditUserModal));

export default async function UsersPage() {
  const session = await getSession();

  let users: any[] = [];
  try {
    const prismaAny = prisma as any;
    const rawUsers: any = await prismaAny.$runCommandRaw({
      find: "User",
      filter: { tenantId: session.tenantId }
    });
    if (rawUsers.cursor?.firstBatch) users = rawUsers.cursor.firstBatch;
  } catch (error) { console.error("FETCH FAIL"); }

  const normalizedUsers = users.map(u => ({
    ...u,
    id: u.id || (typeof u._id === 'object' ? u._id.$oid : u._id),
  }));

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-start">
        <div>
          <h2 className="text-3xl font-bold text-text-main flex items-center gap-4">
            <CheckCircle2 className="text-primary" size={32} />
            إدارة الموظفين (Full Control)
          </h2>
          <p className="text-text-muted mt-2 text-lg">تحكم كامل في بيانات الموظفين، أقسامهم، وصلاحياتهم.</p>
        </div>
        <AddUserModal />
      </div>

      <div className="soft-card p-0 overflow-hidden border border-white/5 bg-bg-surface/30 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start">
            <thead className="bg-bg-surface/50 border-b border-border-subtle text-start">
              <tr>
                <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-start">المستخدم</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-start">الصلاحية</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-start">القسم</th>
                <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-end">الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {normalizedUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-text-muted italic">لا يوجد موظفون مسجلون حالياً.</td>
                </tr>
              ) : (
                normalizedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 text-start">
                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/10 shadow-inner">
                          {user.name?.[0] || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-text-main">{user.name}</p>
                          <p className="text-xs text-text-muted flex items-center gap-1">
                            <Mail size={10} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-start">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-base border border-border-subtle w-fit">
                        <Shield size={12} className="text-primary" />
                        <span className="text-[10px] font-bold text-text-main uppercase tracking-tighter">ROLE_ID: {user.roleId?.substring(0, 6)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-start">
                      <div className="flex items-center gap-2 text-text-muted bg-bg-base/50 px-3 py-1.5 rounded-lg border border-border-subtle/50 w-fit">
                        <Building2 size={12} />
                        <span className="text-[10px] font-bold">DEPT_ID: {user.departmentId?.substring(0, 6)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-end">
                      <div className="flex items-center justify-end gap-2">
                        {/* 🚀 Integrated Edit User Modal */}
                        <EditUserModal user={user} />
                        <button className="p-2 rounded-lg hover:bg-bg-surface text-text-muted hover:text-white transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

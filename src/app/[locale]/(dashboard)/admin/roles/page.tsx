import { prisma } from "@/infra/db/prisma";
import { getSession } from "@/infra/auth/session";
import { ALL_PERMISSIONS } from "@/lib/rbac";
import { RoleCard } from "./RoleCard";
import { ShieldCheck, Plus } from "lucide-react";

export default async function RolesPage() {
  const session = await getSession();

  const roles = await prisma.role.findMany({
    where: { tenantId: session.tenantId },
    include: { 
      users: { select: { id: true, name: true, email: true } }, // 🔍 Fetch linked user details
      _count: { select: { users: true } } 
    }
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-start">
        <div>
          <h2 className="text-3xl font-bold text-text-main flex items-center gap-3">
            <ShieldCheck className="text-primary" size={32} />
            إدارة الصلاحيات الحقيقية (RBAC)
          </h2>
          <p className="text-text-muted mt-2">تحكم في كل زر وكل صفحة تظهر للموظف.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95">
          <Plus size={20} />
          <span>إنشاء دور جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {roles.map((role: any) => (
          <RoleCard 
            key={role.id} 
            role={role} 
            availablePermissions={ALL_PERMISSIONS} 
          />
        ))}
      </div>
    </div>
  );
}

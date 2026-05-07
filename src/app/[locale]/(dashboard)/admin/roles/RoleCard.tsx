"use client";

import { useState } from "react";
import { Key, CheckCircle2, ShieldAlert, Loader2, Info, Trash2, LayoutGrid, List, CheckSquare, Square, User } from "lucide-react";
import { cn } from "@/utils/cn";
import { updateRolePermissionsAction, deleteRoleAction } from "@/app/actions/admin-actions";

interface RoleCardProps {
  role: any;
  availablePermissions: string[];
}

export function RoleCard({ role, availablePermissions }: RoleCardProps) {
  const [currentPermissions, setCurrentPermissions] = useState<string[]>(role.permissions || []);
  const [loading, setLoading] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUsers, setShowUsers] = useState(false); // 🔍 Toggle users list

  const updatePermissions = async (newPermissions: string[], logPrefix: string) => {
    setLoading("ALL");
    setCurrentPermissions(newPermissions);
    try {
      const result = await updateRolePermissionsAction(role.id, newPermissions);
      if (result.error) {
        setCurrentPermissions(role.permissions);
        alert(result.error);
      }
    } catch (err) {
      setCurrentPermissions(role.permissions);
    } finally {
      setLoading(null);
    }
  };

  const togglePermission = async (perm: string) => {
    const isAdding = !currentPermissions.includes(perm);
    const newPermissions = isAdding
      ? [...currentPermissions, perm]
      : currentPermissions.filter(p => p !== perm);
    
    setLoading(perm);
    setCurrentPermissions(newPermissions);

    try {
      const result = await updateRolePermissionsAction(role.id, newPermissions);
      if (result.error) {
        setCurrentPermissions(currentPermissions);
        alert(result.error);
      }
    } catch (err) {
      setCurrentPermissions(currentPermissions);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الدور بالكامل؟")) return;
    setIsDeleting(true);
    const result = await deleteRoleAction(role.id);
    if (result.error) {
      alert(result.error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="soft-card group p-8 hover:border-primary/20 transition-all bg-bg-surface/30 backdrop-blur-sm relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 text-start">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
            <Key size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-text-main">{role.name}</h3>
            <button 
              onClick={() => setShowUsers(!showUsers)}
              className="text-xs text-text-muted font-mono flex items-center gap-2 hover:text-primary transition-colors mt-1"
            >
              <User size={12} />
              {role._count?.users || 0} موظف معين (عرض القائمة)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-bg-base/50 p-1 rounded-xl border border-border-subtle">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-primary text-white" : "text-text-muted hover:text-text-main")}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-primary text-white" : "text-text-muted hover:text-text-main")}
            >
              <List size={16} />
            </button>
          </div>

          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>

      {/* 👥 Users List Dropdown */}
      {showUsers && (
        <div className="mb-6 p-4 rounded-2xl bg-bg-base/50 border border-border-subtle animate-in slide-in-from-top-2 duration-200">
          <h4 className="text-[10px] font-bold text-text-muted uppercase mb-3 px-2">قائمة الموظفين في هذا الدور:</h4>
          <div className="space-y-2">
            {role.users?.length > 0 ? role.users.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{u.name[0]}</div>
                  <div className="text-start">
                    <p className="text-[11px] font-bold text-text-main">{u.name}</p>
                    <p className="text-[9px] text-text-muted">{u.email}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-[10px] text-text-muted italic px-2">لا يوجد موظفون معينون لهذا الدور حالياً.</p>
            )}
          </div>
        </div>
      )}

      {/* 🛠️ Bulk Actions */}
      <div className="flex items-center justify-between mb-6 bg-primary/5 p-4 rounded-2xl border border-primary/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => updatePermissions(availablePermissions, "SELECT_ALL")}
            disabled={loading !== null}
            className="flex items-center gap-2 text-[11px] font-bold text-primary hover:underline disabled:opacity-50"
          >
            <CheckSquare size={14} /> تفعيل الكل
          </button>
          <button 
            onClick={() => updatePermissions([], "UNSELECT_ALL")}
            disabled={loading !== null}
            className="flex items-center gap-2 text-[11px] font-bold text-red-400 hover:underline disabled:opacity-50"
          >
            <Square size={14} /> إلغاء الكل
          </button>
        </div>
        <span className="text-[10px] font-bold text-text-muted">{currentPermissions.length} / {availablePermissions.length} مفعلة</span>
      </div>

      <div className="space-y-4 text-start">
        <div className={cn(
          "gap-3",
          viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2" : "flex flex-col"
        )}>
          {availablePermissions.map((perm) => {
            const isEnabled = currentPermissions.includes(perm);
            return (
              <button 
                key={perm}
                disabled={loading !== null || isDeleting}
                onClick={() => togglePermission(perm)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all text-start relative group/btn overflow-hidden",
                  isEnabled
                    ? "bg-primary/10 border-primary/40 text-text-main shadow-lg shadow-primary/5"
                    : "bg-bg-base/40 border-border-subtle text-text-muted opacity-60 hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <div className={cn(
                    "size-8 rounded-lg flex items-center justify-center",
                    isEnabled ? "bg-primary text-white" : "bg-bg-surface text-text-muted"
                  )}>
                    {isEnabled ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-bold tracking-tighter uppercase">{perm}</span>
                    <span className="text-[9px] opacity-60">{isEnabled ? "مسموح" : "محظور"}</span>
                  </div>
                </div>
                {loading === perm && <Loader2 size={16} className="animate-spin text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {loading === "ALL" && (
        <div className="absolute inset-0 bg-bg-surface/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-primary" />
            <p className="text-sm font-bold text-text-main">جاري تحديث كافة الصلاحيات...</p>
          </div>
        </div>
      )}
    </div>
  );
}

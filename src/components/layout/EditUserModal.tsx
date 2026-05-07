"use client";

import { useState, useEffect } from "react";
import { X, Loader2, Shield, Building, User, Trash2, Save, Key } from "lucide-react";
import { updateUserAction, deleteUserAction } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

interface EditUserModalProps {
  user: any;
}

export function EditUserModal({ user }: EditUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setFetching(true);
        try {
          const res = await fetch("/api/admin/setup-data");
          const data = await res.json();
          if (data.roles) setRoles(data.roles);
          if (data.departments) setDepartments(data.departments);
        } catch (err) { console.error("Fetch Fail"); }
        finally { setFetching(false); }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      roleId: formData.get("roleId"),
      departmentId: formData.get("departmentId"),
      password: formData.get("password") || undefined,
    };

    const result = await updateUserAction(user.id, data);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      router.refresh();
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف نهائياً؟")) return;
    setLoading(true);
    const result = await deleteUserAction(user.id);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-primary transition-colors"
      >
        <User size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-xl bg-bg-surface rounded-[2.5rem] border border-white/10 shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-8 border-b border-border-subtle bg-white/5 flex items-center justify-between text-start">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <User size={24} className="text-primary" />
                تعديل بيانات الموظف
              </h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar text-start">
              {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase px-1">الاسم</label>
                  <input name="name" defaultValue={user.name} required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 text-white outline-none focus:border-primary/40" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase px-1">البريد</label>
                  <input name="email" type="email" defaultValue={user.email} required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 text-white outline-none focus:border-primary/40" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-2 px-1">
                  <Key size={12} className="text-orange-500" /> تعيين كلمة مرور جديدة (اختياري)
                </label>
                <input name="password" type="password" placeholder="اتركها فارغة لعدم التغيير" className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 text-white outline-none focus:border-primary/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-2 px-1">
                    <Building size={14} className="text-primary" /> القسم
                  </label>
                  <select name="departmentId" defaultValue={user.departmentId} required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 text-white appearance-none cursor-pointer">
                    <option value="">{fetching ? "جاري التحميل..." : "اختر القسم..."}</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id} className="bg-bg-surface text-white">{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase flex items-center gap-2 px-1">
                    <Shield size={14} className="text-primary" /> الدور (الصلاحية)
                  </label>
                  <select name="roleId" defaultValue={user.roleId} required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 text-white appearance-none cursor-pointer">
                    <option value="">{fetching ? "جاري التحميل..." : "اختر الصلاحية..."}</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id} className="bg-bg-surface text-white">{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 flex items-center justify-between border-t border-border-subtle">
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                حذف الموظف
              </button>

              <div className="flex gap-4">
                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-3 rounded-xl text-sm font-bold text-text-muted hover:text-white transition-colors">إلغاء</button>
                <button type="submit" disabled={loading || fetching} className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  حفظ التعديلات
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

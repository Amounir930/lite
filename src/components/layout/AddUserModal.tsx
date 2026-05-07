"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Loader2, Shield, Building } from "lucide-react";
import { createUserAction } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

export function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  const router = useRouter();

  // 🔄 Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setFetching(true);
        try {
          const res = await fetch("/api/admin/setup-data");
          const data = await res.json();
          if (data.roles) setRoles(data.roles);
          if (data.departments) setDepartments(data.departments);
        } catch (err) {
          console.error("Failed to fetch setup data");
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createUserAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setIsOpen(false);
      router.refresh();
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95"
      >
        <UserPlus size={20} />
        <span>إضافة مستخدم جديد</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-xl bg-bg-surface rounded-[2.5rem] border border-white/10 shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-8 border-b border-border-subtle bg-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">إضافة عضو جديد للفريق</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-start">{error}</div>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-start">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">الاسم الكامل</label>
                  <input name="name" required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white placeholder:text-white/20" placeholder="مثلاً: أحمد محمد" />
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">البريد الإلكتروني</label>
                  <input name="email" type="email" required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white placeholder:text-white/20" placeholder="admin@example.com" />
                </div>
              </div>

              <div className="space-y-2 text-start">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">كلمة المرور المؤقتة</label>
                <input name="password" type="password" required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white placeholder:text-white/20" placeholder="••••••••" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 text-start relative">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                    <Building size={14} className="text-primary" /> القسم
                  </label>
                  <select name="departmentId" required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white appearance-none cursor-pointer">
                    <option value="">{fetching ? "جاري التحميل..." : "اختر القسم..."}</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id} className="bg-bg-surface text-white">{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 text-start">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2 px-1">
                    <Shield size={14} className="text-primary" /> الدور (الصلاحية)
                  </label>
                  <select name="roleId" required className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white appearance-none cursor-pointer">
                    <option value="">{fetching ? "جاري التحميل..." : "اختر الصلاحية..."}</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id} className="bg-bg-surface text-white">{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 flex justify-end gap-4 border-t border-border-subtle">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-xl text-sm font-bold text-text-muted hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button 
                type="submit"
                disabled={loading || fetching}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
                حفظ المستخدم
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

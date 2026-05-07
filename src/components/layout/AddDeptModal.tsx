"use client";

import { useState } from "react";
import { X, Plus, Loader2, Building2 } from "lucide-react";
import { createDepartmentAction } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

export function AddDeptModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const result = await createDepartmentAction(name, slug);

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
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95"
      >
        <Plus size={20} />
        <span>إضافة قسم جديد</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg soft-card p-0 overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border border-white/5"
          >
            <div className="p-8 border-b border-border-subtle bg-bg-surface/50 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-text-main flex items-center gap-3">
                <Building2 size={24} className="text-primary" />
                إنشاء قسم جديد
              </h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">{error}</div>}

              <div className="space-y-3 text-start">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">اسم القسم</label>
                <input 
                  name="name" 
                  required 
                  autoFocus
                  placeholder="مثلاً: خدمة العملاء، المبيعات..."
                  className="w-full rounded-xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-text-main" 
                />
                <p className="text-[10px] text-text-muted px-1 italic">سيتم توليد المعرف الآلي (Slug) بناءً على الاسم.</p>
              </div>
            </div>

            <div className="p-8 bg-primary/5 flex justify-end gap-4 border-t border-border-subtle">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-xl text-sm font-bold text-text-muted hover:text-text-main transition-colors"
              >
                إلغاء
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                إنشاء القسم
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

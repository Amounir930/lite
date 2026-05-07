"use client";

import { useState } from "react";
import { X, Plus, Loader2, Users } from "lucide-react";
import { createTeamAction } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

interface AddTeamModalProps {
  departmentId: string;
}

export function AddTeamModal({ departmentId }: AddTeamModalProps) {
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

    const result = await createTeamAction(departmentId, name);

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
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary hover:text-white transition-all border border-primary/20"
      >
        <Plus size={12} />
        إضافة فريق فرعي
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-md bg-bg-surface rounded-[2rem] border border-white/10 shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-6 border-b border-border-subtle bg-white/5 flex items-center justify-between text-start">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Users size={20} className="text-primary" />
                إنشاء فريق جديد
              </h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-4 text-start">
              {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold">{error}</div>}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-1">اسم الفريق</label>
                <input 
                  name="name" 
                  required 
                  autoFocus
                  placeholder="مثلاً: فريق الدعم الفني، مبيعات الخليج..."
                  className="w-full rounded-xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white text-sm" 
                />
              </div>
            </div>

            <div className="p-6 bg-white/5 flex justify-end gap-3 border-t border-border-subtle">
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-xl text-[11px] font-bold text-text-muted hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white text-[11px] font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                إنشاء الفريق
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

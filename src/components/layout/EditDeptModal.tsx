"use client";

import { useState } from "react";
import { X, Loader2, Building2, Trash2, Save, ArrowRight, Info } from "lucide-react";
import { updateDepartmentAction, deleteDepartmentAction } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

interface EditDeptModalProps {
  dept: any;
  deptId: string;
}

export function EditDeptModal({ dept, deptId }: EditDeptModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const result = await updateDepartmentAction(deptId, name);

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
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟ لا يمكن التراجع عن ذلك.")) return;
    setDeleting(true);
    const result = await deleteDepartmentAction(deptId);
    if (result.error) {
      setError(result.error);
      setDeleting(false);
    } else {
      setIsOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-8 py-5 bg-primary/5 flex items-center justify-between hover:bg-primary/10 transition-colors w-full group-hover:bg-primary/10 border-t border-border-subtle/50"
      >
        <span className="text-xs font-bold text-primary">تعديل بيانات القسم</span>
        <ArrowRight size={16} className="text-primary transform group-hover:translate-x-1 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)} />
          
          <form 
            onSubmit={handleSubmit}
            className="relative w-full max-w-lg bg-bg-surface rounded-[2.5rem] border border-white/10 shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-8 border-b border-border-subtle bg-white/5 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Building2 size={24} className="text-primary" />
                تعديل القسم
              </h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-start font-bold">{error}</div>}

              <div className="space-y-3 text-start">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">اسم القسم الجديد</label>
                <input 
                  name="name" 
                  required 
                  defaultValue={dept.name}
                  className="w-full rounded-2xl bg-bg-base border border-border-subtle p-4 outline-none focus:border-primary/40 transition-all text-white" 
                />
              </div>

              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-3 text-start">
                <Info size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-text-muted leading-relaxed italic">
                  عند تغيير الاسم، سيتم تحديث الهوية (Slug) تلقائياً ليتوافق مع المسمى الجديد.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white/5 flex items-center justify-between border-t border-border-subtle">
              <button 
                type="button" 
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
              >
                {deleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                حذف القسم
              </button>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-text-muted hover:text-white transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all disabled:opacity-50"
                >
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

"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth-actions";
import { Lock, Mail, ArrowRight, Shield, AlertCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const params = useParams();
  const locale = params?.locale as string || "ar";
  
  // 🧪 Using useActionState for better UX
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6 py-12 font-sans overflow-hidden relative">
      {/* 🌌 Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* 🛡️ Header Section */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/10">
            <Shield size={40} className="text-primary" />
          </div>
          <h1 className="mt-8 text-3xl font-bold tracking-tight text-white">
            بوابة الوصول الأكاديمي
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            WhatSaaS Lite v1.0.5 — Secure Orchestration
          </p>
        </div>

        {/* ⚠️ Error Alert */}
        {state?.error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} />
            <p>{state.error}</p>
          </div>
        )}

        {/* 📋 Form Section */}
        <form action={formAction} className="mt-10 space-y-6">
          <input type="hidden" name="locale" value={locale} />
          
          <div className="space-y-4">
            <div className="relative group">
              <Mail size={18} className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                name="email"
                type="email" 
                placeholder="البريد الإلكتروني"
                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] py-4.5 ps-12 pe-4 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                required
                disabled={isPending}
              />
            </div>
            
            <div className="relative group">
              <Lock size={18} className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input 
                name="password"
                type="password" 
                placeholder="كلمة المرور"
                className="w-full rounded-2xl border border-white/5 bg-white/[0.03] py-4.5 ps-12 pe-4 text-sm text-white outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all placeholder:text-slate-600"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4.5 font-bold text-white shadow-2xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>دخول النظام</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* 🔗 Footer Links */}
        <div className="text-center pt-4">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Identity Verified via JWT & Iron Session
          </p>
        </div>
      </div>
    </div>
  );
}

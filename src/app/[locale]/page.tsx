import { Terminal, Shield, Cpu, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WelcomePage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#0a0a0b] text-[#e4e4e7]">
      <div className="mb-12">
        <div className="inline-flex items-center justify-center p-4 rounded-xl border border-white/10 bg-white/5">
          <Terminal size={48} className="text-primary" />
        </div>
      </div>

      <h1 className="glow-text mb-6 text-5xl font-bold tracking-tight sm:text-7xl font-sans">
        WhatSaaS <span className="text-primary">Lite Edition</span>
      </h1>
      
      <p className="mb-10 max-w-2xl text-lg text-white/50 leading-relaxed font-light">
        A professional-grade WhatsApp CRM framework architected for high-performance enterprise applications.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <button className="rounded-lg bg-primary px-10 py-4 font-semibold text-white shadow-xl shadow-primary/10 transition-all hover:bg-blue-600 active:scale-95">
          Initialize System
        </button>
      </div>
    </div>
  );
}

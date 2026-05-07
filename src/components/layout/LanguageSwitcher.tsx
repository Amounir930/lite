"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 text-slate-400 hover:text-primary transition-all group"
      title={locale === "ar" ? "Switch to English" : "التحويل للعربية"}
    >
      <Languages size={20} />
      <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary">
        {locale === "ar" ? "EN" : "AR"}
      </span>
    </button>
  );
}

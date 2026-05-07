"use client";

import { useState } from "react";
import { UserCircle, ChevronDown, Mail, Shield, Settings } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

interface UserMenuProps {
  name: string;
  email: string;
  role: string;
}

export function UserMenu({ name, email, role }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Common");

  return (
    <div className="relative">
      {/* 👤 Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-4 p-1.5 pe-4 rounded-2xl bg-bg-surface border border-border-subtle hover:border-primary/20 transition-all outline-none",
          isOpen && "border-primary/40 ring-4 ring-primary/5"
        )}
      >
        <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-inner">
          <UserCircle size={24} className="text-primary" />
        </div>
        <div className="text-start hidden lg:block pr-2">
          <p className="text-sm font-bold text-text-main leading-tight">{name}</p>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">{role}</p>
        </div>
        <ChevronDown size={14} className={cn("text-text-muted transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {/* 📂 Dropdown Card */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-14 inset-inline-end-0 z-50 w-72 mt-2 soft-card p-4 animate-in fade-in zoom-in-95 duration-200 shadow-2xl ring-1 ring-black/5">
            {/* Header: User Info */}
            <div className="mb-4 pb-4 border-b border-border-subtle text-start">
              <p className="text-sm font-bold text-text-main truncate">{name}</p>
              <div className="flex items-center gap-2 mt-1 text-text-muted">
                <Mail size={12} />
                <span className="text-[11px] truncate">{email}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-1">
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-text-muted hover:bg-primary/5 hover:text-primary transition-all text-start">
                <Shield size={14} />
                <span>{t("manage_permissions")}</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-text-muted hover:bg-primary/5 hover:text-primary transition-all text-start">
                <Settings size={14} />
                <span>{t("account_settings")}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

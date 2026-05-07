"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  PieChart, 
  Zap,
  ShieldCheck,
  Building2,
  Lock,
  ChevronRight
} from "lucide-react";
import { cn } from "@/utils/cn";

const sidebarItems = [
  { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard, permission: "PAGE_DASHBOARD" },
  { name: "جهات الاتصال", href: "/contacts", icon: Users, permission: "PAGE_CONTACTS" },
  { name: "المحادثات", href: "/chat", icon: MessageSquare, permission: "PAGE_CHAT" },
  { name: "مركز الإدارة", href: "/admin/users", icon: ShieldCheck, permission: "PAGE_ADMIN" },
  { name: "الأتمتة", href: "/automation", icon: Zap, permission: "PAGE_AUTOMATION" },
  { name: "التقارير", href: "/reports", icon: PieChart, permission: "PAGE_REPORTS" },
  { name: "الإعدادات", href: "/settings", icon: Settings, permission: "PAGE_SETTINGS" },
];

export function Sidebar({ userPermissions = [] }: { userPermissions?: string[] }) {
  const pathname = usePathname();

  // 🛡️ Expert Logic: Always show Admin for testing or if permissions match
  const filteredItems = sidebarItems.filter(item => {
    if (userPermissions.includes("ALL")) return true;
    return userPermissions.includes(item.permission) || item.permission === "PAGE_ADMIN";
  });

  return (
    <aside className="w-80 h-screen bg-bg-surface/30 backdrop-blur-xl border-e border-white/5 flex flex-col sticky top-0 overflow-hidden group/sidebar transition-all duration-500">
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 transform group-hover/sidebar:rotate-12 transition-transform duration-500">
            <Zap size={24} />
          </div>
          <div className="text-start">
            <h1 className="text-xl font-black text-white tracking-tighter">WhatSaaS</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Lite Edition</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={`/ar${item.href}`}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group/item relative overflow-hidden",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <item.icon size={22} className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover/item:scale-110")} />
                <span className="font-bold text-sm">{item.name}</span>
              </div>
              <ChevronRight size={16} className={cn("transition-all duration-300 opacity-0 transform -translate-x-4", isActive && "opacity-100 translate-x-0")} />
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-[2rem] bg-gradient-to-br from-bg-surface to-bg-base border border-white/5 relative overflow-hidden">
          <div className="size-20 rounded-full bg-primary/10 blur-2xl absolute -top-10 -right-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">حالة النظام: مثالية</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

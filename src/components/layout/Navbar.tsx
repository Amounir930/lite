import { getTranslations } from "next-intl/server";
import { Bell, Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LogoutButton } from "./LogoutButton";
import { UserMenu } from "./UserMenu";
import { getSession } from "@/infra/auth/session";

export async function Navbar() {
  const t = await getTranslations("Common");
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between bg-bg-base/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 border-b border-border-subtle lg:border-none transition-all duration-300">
      {/* 🔍 Search Section */}
      <div className="hidden sm:flex flex-1 items-center max-w-xs md:max-w-lg">
        <div className="relative w-full group">
          <Search size={18} className="absolute inset-inline-start-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder={t("search_placeholder")}
            className="w-full rounded-2xl border border-border-subtle bg-bg-surface/50 py-2.5 ps-11 pe-4 text-sm outline-none focus:border-primary/30 transition-all placeholder:text-slate-500 text-start"
          />
        </div>
      </div>

      {/* 🛠️ Actions Section */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto lg:ml-0">
        <div className="flex items-center gap-1.5 md:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          
          <button className="relative p-2.5 rounded-xl bg-bg-surface border border-border-subtle hover:bg-white/5 transition-all group hidden md:block">
            <Bell size={18} className="text-text-muted group-hover:text-primary" />
            <span className="absolute top-2.5 inset-inline-end-2.5 size-2 rounded-full bg-primary ring-2 ring-bg-base"></span>
          </button>
        </div>
        
        <div className="h-8 w-px bg-border-subtle mx-1 md:mx-2"></div>
        
        {/* User Dropdown Menu */}
        <div className="flex items-center gap-2 md:gap-3">
          <UserMenu 
            name={session.isLoggedIn ? "المشرف الأكاديمي" : "Guest User"} 
            email="admin@whatsaas.com"
            role={session.role || "Admin"}
          />

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}

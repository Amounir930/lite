"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import * as Icons from "lucide-react";

interface Tab {
  name: string;
  href: string;
  iconName: keyof typeof Icons; // 🔑 Pass name as string
}

export function AdminTabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-bg-surface border border-border-subtle w-fit overflow-x-auto max-w-full">
      {tabs.map((tab) => {
        const isActive = pathname.includes(tab.href);
        const Icon = Icons[tab.iconName] as React.ElementType;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              isActive 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-text-muted hover:bg-primary/5 hover:text-primary"
            )}
          >
            {Icon && <Icon size={18} />}
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

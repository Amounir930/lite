"use client";

import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/app/actions/auth-actions";
import { useTransition } from "react";
import { useRouter, useParams } from "next/navigation";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "ar";

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logoutAction();
      if (result.success) {
        router.push(`/${locale}/login`);
        router.refresh();
      }
    });
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isPending}
      className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50 shadow-sm"
      title="Logout"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <LogOut size={18} />
      )}
    </button>
  );
}

import { getTranslations } from "next-intl/server";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity 
} from "lucide-react";

export default async function DashboardPage({ 
  params 
}: { 
  params: Promise<{ locale: string }> 
}) {
  const { locale } = await params;
  const t = await getTranslations("Dashboard");

  const stats = [
    { name: t("total_contacts"), value: "12,450", change: "+12%", icon: Users },
    { name: t("daily_messages"), value: "3,200", change: "+5%", icon: MessageSquare },
    { name: t("response_rate"), value: "98.2%", change: "+2%", icon: Activity },
    { name: t("campaign_growth"), value: "24.5%", change: "+18%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* 🧭 Header */}
      <div className="flex flex-col gap-1 text-start">
        <h1 className="text-4xl font-bold tracking-tight text-text-main">{t("title")}</h1>
        <p className="text-text-muted text-lg">{t("description")}</p>
      </div>

      {/* 📊 Metrics Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 text-start">
        {stats.map((stat) => (
          <div key={stat.name} className="soft-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/10">
                <stat.icon size={24} />
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold font-mono">
                {stat.change}
              </div>
            </div>
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">{stat.name}</p>
            <p className="text-3xl font-bold text-text-main">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

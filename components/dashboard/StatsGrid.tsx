'use client'

import { Wallet, CheckCircle2, Clock } from "lucide-react";

export function StatsGrid({ statsData }: { statsData: any }) {
  const stats = [
    { label: "Today's Earnings", value: statsData?.todayEarnings || "₦0", icon: Wallet, color: "text-green-600", bg: "bg-green-100" },
    { label: "Completed Today", value: statsData?.completedToday || "0", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Hours Online", value: statsData?.hoursOnline || "0h 0m", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}

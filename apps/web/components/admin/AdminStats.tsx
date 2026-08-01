"use client";

import React from "react";
import { Users, DollarSign, Activity, Database } from "lucide-react";
import { GlobalStats } from "../../types";

interface AdminStatsProps {
  stats: GlobalStats;
  isLoading: boolean;
}

export default function AdminStats({ stats, isLoading }: AdminStatsProps) {
  const cards = [
    { label: "Total Registry", val: stats.totalUsers, icon: <Users className="h-6 w-6" /> },
    { label: "Active Workspace MRR", val: `$${stats.monthlyRevenue}`, icon: <DollarSign className="h-6 w-6" /> },
    { label: "Analyses Volume", val: stats.totalAnalyses, icon: <Activity className="h-6 w-6" /> },
    { label: "Gateway Uptime", val: `${stats.reliabilityPercent}%`, icon: <Database className="h-6 w-6" /> }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
      {cards.map((card, i) => (
        <div key={i} className="p-5 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md relative overflow-hidden">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {isLoading ? "..." : card.val}
          </span>
          <div className="absolute right-3 bottom-3 opacity-5 text-white">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

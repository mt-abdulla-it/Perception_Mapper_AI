"use client";

import React from "react";
import { SubscriptionTier } from "../../lib/auth";
import { Zap, ShieldCheck, Flame } from "lucide-react";

interface TierSelectorProps {
  currentTier: SubscriptionTier;
  onChangeTier: (tier: SubscriptionTier) => void;
}

export default function TierSelector({ currentTier, onChangeTier }: TierSelectorProps) {
  const tiers: { id: SubscriptionTier; label: string; icon: typeof Zap; color: string; desc: string }[] = [
    {
      id: "FREE",
      label: "Free",
      icon: Zap,
      color: "from-cyan-500 to-blue-500 text-cyan-400",
      desc: "Acoustic Basic Gateway"
    },
    {
      id: "BASIC",
      label: "Basic",
      icon: Flame,
      color: "from-purple-500 to-indigo-500 text-purple-400",
      desc: "Pro Workspace Suite"
    },
    {
      id: "PRO",
      label: "Pro",
      icon: ShieldCheck,
      color: "from-pink-500 to-rose-500 text-pink-400",
      desc: "Enterprise OS Telemetry"
    }
  ];

  return (
    <div className="w-full bg-slate-900/30 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 font-sans select-none relative z-20">
      <div className="text-left pl-2">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Workspace Profile</span>
        <span className="text-xs font-bold text-slate-300">Choose active telemetry scope</span>
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center gap-2.5 w-full md:w-auto">
        {tiers.map((t) => {
          const isActive = currentTier === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onChangeTier(t.id)}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 w-full md:w-auto relative ${
                isActive
                  ? "bg-slate-950/90 border-slate-800/80 shadow-lg text-white"
                  : "bg-slate-950/20 border-transparent hover:border-slate-900 text-slate-500 hover:text-slate-400"
              }`}
            >
              {isActive && (
                <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] rounded-full bg-gradient-to-r ${t.color}`} />
              )}
              
              <div className={`p-1.5 rounded-lg ${isActive ? "bg-slate-900" : "bg-slate-950/30"}`}>
                <Icon className={`h-3.5 w-3.5 ${isActive ? t.color : "text-slate-650"}`} />
              </div>
              
              <div className="text-left leading-tight">
                <span className="block text-[11px]">{t.label}</span>
                <span className="block text-[9px] font-semibold text-slate-500 tracking-tight">{t.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Card } from "@perception-mapper/ui";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Layers, Zap } from "lucide-react";

export interface PlanData {
  title: string;
  badge: string;
  price: string;
  desc: string;
  features: string[];
  border: string;
  highlight: boolean;
  btnText: string;
  btnClass: string;
  planId: string;
  iconName: "Sparkles" | "Layers" | "Zap";
}

interface PricingCardProps {
  plan: PlanData;
  idx: number;
}

const iconMap = {
  Sparkles: <Sparkles className="w-5 h-5 text-indigo-400" />,
  Layers: <Layers className="w-5 h-5 text-blue-400" />,
  Zap: <Zap className="w-5 h-5 text-cyan-400" />,
};

export default function PricingCard({ plan, idx }: PricingCardProps) {
  const router = useRouter();
  const planIcon = iconMap[plan.iconName] || <Sparkles className="w-5 h-5 text-slate-400" />;

  const handleAction = () => {
    router.push(`/sign-up?plan=${plan.planId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      whileHover={{ scale: 1.025 }}
      className="flex w-full"
    >
      <Card
        className={`p-6 text-center space-y-4 rounded-2xl flex flex-col justify-between w-full border relative overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300 ${
          plan.highlight
            ? "border-cyan-500/50 ring-1 ring-cyan-500/30 bg-slate-900/60 shadow-cyan-500/5"
            : "border-slate-800/80 bg-slate-900/40"
        }`}
      >
        {/* Glow effect for highlighted "Pro" plan */}
        {plan.highlight && (
          <div className="absolute top-0 right-0 w-[120px] h-[120px] rounded-full bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 blur-[20px] pointer-events-none" />
        )}
        
        {plan.highlight && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] font-bold text-white bg-gradient-to-r from-cyan-600 to-purple-600 border border-cyan-500 rounded-full uppercase tracking-widest shadow-md">
            {plan.badge}
          </span>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                {planIcon}
              </div>
              <div className="text-left">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${plan.highlight ? "text-cyan-400" : "text-slate-400"}`}>
                  {plan.title}
                </span>
              </div>
            </div>
            {!plan.highlight && (
              <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-500">
                {plan.badge}
              </span>
            )}
          </div>

          <h4 className="text-3xl font-extrabold text-white text-left flex items-baseline">
            {plan.price} <span className="text-xs text-slate-500 font-semibold ml-1">/ month</span>
          </h4>
          
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed text-left min-h-[30px]">{plan.desc}</p>
          
          <ul className="text-[10px] text-slate-400 space-y-2.5 text-left py-4 border-t border-slate-800">
            {plan.features.map((feat, fIdx) => (
              <li key={fIdx} className="flex items-start space-x-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAction}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center font-sans tracking-wide uppercase shadow-md ${plan.btnClass}`}
        >
          {plan.btnText}
        </button>
      </Card>
    </motion.div>
  );
}

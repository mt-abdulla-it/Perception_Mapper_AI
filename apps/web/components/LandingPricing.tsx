"use client";

import React from "react";
import PricingCard, { PlanData } from "./PricingCard";
import PricingFeatures from "./PricingFeatures";

export default function LandingPricing() {
  const plans: PlanData[] = [
    {
      title: "Free",
      badge: "Starter",
      price: "$0",
      desc: "Perfect for casual writers and individual linguistic testing.",
      features: [
        "50 Analyses / Month",
        "English only parsing",
        "3 core cognitive bias types",
        "Partial tone assessment",
      ],
      border: "border-slate-800/60 bg-slate-950/40 hover:border-slate-700/60 hover:bg-slate-900/10 transition-all duration-300",
      highlight: false,
      btnText: "Start Free",
      btnClass: "bg-slate-950 hover:bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800/80 transition-all duration-200",
      planId: "free",
      iconName: "Sparkles",
    },
    {
      title: "Basic",
      badge: "Popular",
      price: "$19",
      desc: "Empowers publishers and professionals with multi-locale analysis.",
      features: [
        "500 Analyses / Month",
        "EN + Tamil + Sinhala",
        "All cognitive bias types",
        "Objective rephrasing & CSV/PDF",
      ],
      border: "border-slate-800/60 bg-slate-950/40 hover:border-indigo-500/20 hover:bg-indigo-950/5 transition-all duration-300",
      highlight: false,
      btnText: "Get Basic",
      btnClass: "bg-indigo-950/20 hover:bg-indigo-900/30 text-indigo-400 hover:text-indigo-300 border border-indigo-500/25 transition-all duration-200 shadow-sm",
      planId: "basic",
      iconName: "Layers",
    },
    {
      title: "Pro",
      badge: "Most Popular",
      price: "$59",
      desc: "Full-scale workspace pipeline built for agile editing groups.",
      features: [
        "Unlimited Analysis requests",
        "API Access + X-API-Key",
        "Team Workspace integration",
        "Custom webhooks & priority support",
      ],
      border: "border-cyan-500/25 ring-1 ring-cyan-500/10 bg-slate-950/60 shadow-cyan-500/5 hover:border-cyan-500/40 hover:ring-cyan-500/20 transition-all duration-300 shadow-xl",
      highlight: true,
      btnText: "Get Pro",
      btnClass: "bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-cyan-600/15 border border-cyan-400/25 transition-all duration-200",
      planId: "pro",
      iconName: "Zap",
    },
  ];

  return (
    <div id="pricing" className="w-full max-w-5xl mx-auto py-16 space-y-12 relative z-10 select-none">
      <div className="text-center space-y-3">
        <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider">
          Plans & Pricing
        </h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Choose the plan that fits your team's needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <PricingCard key={plan.planId} plan={plan} idx={idx} />
        ))}
      </div>

      <PricingFeatures />

      <div className="text-center pt-4">
        <a
          href="/pricing"
          className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition duration-200"
        >
          <span>Compare full features & enterprise details</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Check, X, ShieldAlert, Globe, FileText, Zap } from "lucide-react";

interface FeatureRow {
  name: string;
  free: string | boolean;
  basic: string | boolean;
  pro: string | boolean;
  icon: React.ReactNode;
}

export default function PricingFeatures() {
  const features: FeatureRow[] = [
    {
      name: "Supported Locales",
      free: "English only",
      basic: "EN + TA + SI",
      pro: "EN + TA + SI",
      icon: <Globe className="w-3.5 h-3.5 text-indigo-400" />,
    },
    {
      name: "Cognitive Bias Detection",
      free: "3 types",
      basic: "All categories",
      pro: "All categories",
      icon: <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />,
    },
    {
      name: "Objective Rephrasing",
      free: false,
      basic: true,
      pro: true,
      icon: <Zap className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      name: "CSV + PDF Data Export",
      free: false,
      basic: true,
      pro: true,
      icon: <FileText className="w-3.5 h-3.5 text-pink-400" />,
    },
    {
      name: "Enterprise Workspace Nodes",
      free: false,
      basic: false,
      pro: "Up to 20 seats",
      icon: <Globe className="w-3.5 h-3.5 text-indigo-400" />,
    },
  ];

  const renderVal = (val: string | boolean) => {
    if (typeof val === "string") {
      return <span className="text-slate-300 font-bold">{val}</span>;
    }
    return val ? (
      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
    ) : (
      <X className="w-4 h-4 text-slate-600 mx-auto" />
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
      <h4 className="text-center text-xs font-extrabold uppercase tracking-widest text-indigo-400 mb-6">
        Full Feature Matrix Comparison
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px] text-slate-400 border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-2.5">Capabilities</th>
              <th className="py-2.5 text-center w-24">Free</th>
              <th className="py-2.5 text-center w-24">Basic</th>
              <th className="py-2.5 text-center w-24">Pro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {features.map((f, i) => (
              <tr key={i} className="hover:bg-slate-950/20 transition">
                <td className="py-3 flex items-center space-x-2.5 font-medium">
                  {f.icon}
                  <span>{f.name}</span>
                </td>
                <td className="py-3 text-center">{renderVal(f.free)}</td>
                <td className="py-3 text-center">{renderVal(f.basic)}</td>
                <td className="py-3 text-center">{renderVal(f.pro)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

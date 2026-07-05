"use client";

import React, { useState } from "react";
import { Sliders } from "lucide-react";
import { Button } from "@perception-mapper/ui";
import { PolicySettings } from "../../types";

interface AdminPoliciesFormProps {
  policies: PolicySettings;
  onSave: (updated: PolicySettings) => void;
  isLoading: boolean;
}

export default function AdminPoliciesForm({ policies, onSave, isLoading }: AdminPoliciesFormProps) {
  const [state, setState] = useState<PolicySettings>(policies);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(state);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-md space-y-6 text-xs text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center">
            <Sliders className="h-4 w-4 text-purple-400 mr-2" /> Global Safety Overrides
          </h3>
          <span className="text-[8px] text-slate-500 block mt-0.5">Safety classifications caching control</span>
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Feature Toggles</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Text Perception", val: state.textEnabled, key: "textEnabled" as const },
            { label: "Voice Decipher", val: state.voiceEnabled, key: "voiceEnabled" as const },
            { label: "Image Optical Scanner", val: state.imageEnabled, key: "imageEnabled" as const }
          ].map((item) => (
            <div key={item.key} className="p-4 rounded-xl border border-slate-900 bg-slate-950/60 flex items-center justify-between font-sans">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={item.val}
                onChange={(e) => setState({ ...state, [item.key]: e.target.checked })}
                className="accent-purple-500 h-4 w-4 rounded border-slate-800"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Monthly Limit Quotas</span>
        <div className="grid grid-cols-3 gap-4 font-sans">
          {[
            { label: "FREE Limit", val: state.limitFree, key: "limitFree" as const },
            { label: "PRO Limit", val: state.limitPro, key: "limitPro" as const },
            { label: "TEAM Limit", val: state.limitTeam, key: "limitTeam" as const }
          ].map((item) => (
            <div key={item.key} className="space-y-1.5">
              <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">{item.label}</label>
              <input
                type="number"
                value={item.val}
                onChange={(e) => setState({ ...state, [item.key]: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-purple-500 transition outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">Rate Limiting (RPM)</span>
        <div className="grid grid-cols-3 gap-4 font-sans">
          {[
            { label: "FREE Rate", val: state.rateFree, key: "rateFree" as const },
            { label: "PRO Rate", val: state.ratePro, key: "ratePro" as const },
            { label: "TEAM Rate", val: state.rateTeam, key: "rateTeam" as const }
          ].map((item) => (
            <div key={item.key} className="space-y-1.5">
              <label className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">{item.label}</label>
              <input
                type="number"
                value={item.val}
                onChange={(e) => setState({ ...state, [item.key]: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:border-purple-500 transition outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" variant="primary" size="sm" className="w-full" disabled={isLoading}>
        Save Global Safety Cache
      </Button>
    </form>
  );
}
